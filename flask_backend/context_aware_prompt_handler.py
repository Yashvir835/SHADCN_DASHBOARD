from utils import send_message_to_staff
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from pinecone.grpc import PineconeGRPC as Pinecone
import os
from dotenv import load_dotenv
import time
from typing import List, Dict
import yaml

# Load existing config
with open('backend_configs.yaml') as f:
    config = yaml.safe_load(f)

load_dotenv('.env.local')
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
pinecone_client = pc.Index(host= os.getenv('AIRBNB_INDEX_HOST_URL'))

# Modified prompts to include conversation history
CLASSIFICATION_PROMPT = """
You are a precise query classifier for an Airbnb assistant.

Previous conversation:
{conversation_history}

You will be provided with a user's query and context data pulled from a vector database.

Context provided:
{context}

Given query:
{query}

Your task is to classify the query as one of the following:
- **RAG_required:** If answering this query depends on property-specific details present in the provided context.
- **RAG_not_required:** If the query is a general request, service, or question that does not require property-specific details.
- **UNKNOWN:** If the query is unclear or cannot be answered due to missing or insufficient information in the context.

### Guidelines for Classification:
1. **Check if the query is property-specific:**
   - Does it ask about amenities, rules, or property features (e.g., "Does the property have a pool?")?
   - Does it require details about the property layout, location, or policies?

2. **Check if the query is general or common:**
   - Does it ask for common information or services (e.g., "How do I contact support?")?
   - Is it a non-specific request not tied to a particular property (e.g., "I need towels, bottles, and bedsheets.")?
   - Is it an emergency or urgent situation unrelated to the property (e.g., "I lost my wallet.")?

3. **Check the provided context:**
   - Does the context contain the necessary details to answer the query?
   - Is the context relevant to the query?

### Examples for Classification:

**RAG_required:**
- Query: "What is the Wi-Fi password?"
- Context: "Wi-Fi network: DelhiStayWiFi; Password: Delhi2025."
- Explanation: Property-specific info is needed and present in the context.

**RAG_not_required:**
- Query: "How can I request additional towels?"
- Context: "Towels should be placed in the bathroom before checkout."
- Explanation: The query does not depend on property-specific details; it's a general request for more amenities.

**UNKNOWN:**
- Query: "Can I have a spare key?"
- Context: "The lockbox code will be shared upon arrival."
- Explanation: The query lacks sufficient information in the context to determine if spare keys are available.

### Your Response:
After analysis, provide the classification.
NOTE: Any service reuqest queries like room service, emergency or similar quesries should be classified ans RAG_not_Required.

Classification decision:
"""

RAG_RESPONSE_PROMPT = """You are a helpful Hotel Delhi Concierge assistant focused on providing accurate information.

Previous conversation:
{conversation_history}

Think through this step by step:
1. First, identify the key information needed from the query below:
   {query}

2. Second, Take the below information as factually correct to answer user's questions:
   {context}

3. Consider any relevant information from the previous conversation that might affect the response

4. Finally, formulate a concise, friendly response that:
   - Directly answers the question
   - Includes relevant details from context
   - Maintains a helpful, professional tone
   - Stays under 20 words   
   - References previous conversation when relevant

Your response:
"""

GENERAL_RESPONSE_PROMPT = """You are a helpful Airbnb assistant handling service requests and general queries.

Previous conversation:
{conversation_history}

Think through this step by step:
1. Identify the type of request from the query:
   {query}

2. Determine the appropriate response category:
   - Room service requests: Confirm action being taken
   - Emergency situations: Provide immediate assurance and next steps
   - Common questions: Give clear, direct answers
   - Map-based queries: Offer relevant suggestions

3. Craft a response that:
   - Starts with "I'll be glad to help" or similar
   - Provides clear next steps or information
   - Maintains a friendly, professional tone
   - Stays under 20 words if possible.
   

Your response:
"""

STAFF_NOTIFYING_CLASSIFICATION_PROMPT = """
You are a classifier that takes in user prompt and classifies if this query requires staff notification or not.
The user here is an airbnb guest and the staff is the one who is supposed to help the user in certain situations.

User Query:
{query}

You must return 'NOTIFY_STAFF' if the query reuires staff intervention.
You must return 'DONT_NOTIFY_STAFF' if the query doesn't require staff's intervention.

examples:

query: "Hey I need extra towels and an air freshner"
response: 'NOTIFY_STAFF'

query: "Help, I think someone is tresspassing:"
response: 'NOTIFY_STAFF'

query: "What time is it now?"
response: 'DONT_NOTIFY_STAFF'

query: "I am so bored right now. Tell me a joke"
response: 'DONT_NOTIFY_STAFF'

Your response:

"""

STAFF_NOTIFYING_PROMPT = """
You are a message drafter that will use the user's query to noitfy the staff about the user's demands.
The user is an Airbnb customer and the staff is the hosting facilities' staff.

The user's query:
{query}

Your job is to extract information from user's query to a well formed message which has all the information
about user's demands and prepare a message that is to be sent to the hotl staff.

Examples:
i)
Query : "Hey, I need 2 towels, Bedsheets, pillow covers and body shower gel."
Response:
"
The guest needs the following:
1) 2 Towels
2) Bedsheets
3) Pillow Covers
4) Body Shower gel
"

ii)
Query : "Help, I am stuck inside the bathroom"
Response:
"
Emergency!!
The guest is stuck inside the bathroom and needs staff's assistance.
"
Note: Your response must only contain information that is supposed to be sent to the staff. it should be very concise, crisp and contain complete information of user's needs

Your response:

"""

class ConversationMemory:
    def __init__(self, max_turns: int = 5):
        self.conversations: List[Dict[str, str]] = []
        self.max_turns = max_turns
    
    def add_exchange(self, query: str, response: str):
        self.conversations.append({
            "query": query,
            "response": response,
            "timestamp": time.time()
        })
        # Keep only the last max_turns conversations
        if len(self.conversations) > self.max_turns:
            self.conversations.pop(0)
    
    def get_formatted_history(self) -> str:
        if not self.conversations:
            return "No previous conversation."
        
        formatted = []
        for conv in self.conversations:
            formatted.append(f"User: {conv['query']}\nAssistant: {conv['response']}")
        
        return "\n\n".join(formatted)

class ChainOfThoughtHandler:
    def __init__(self):
        self.llm = ChatOpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            model_name=config['openai_model_name'],
            temperature=config['llm_temperature']
        )

        self.embeddings = OpenAIEmbeddings(
            model=config['OpenaiEmbeddings'],
            api_key=os.environ.get('OPENAI_API_KEY')
        )
        
        self.memory = ConversationMemory()
        self.setup_chains()
        
    def setup_chains(self):
        # Classification chain
        self.classification_chain = LLMChain(
            llm=self.llm,
            prompt=PromptTemplate(
                input_variables=["query", "context", "conversation_history"],
                template=CLASSIFICATION_PROMPT
            ),
            verbose=True
        )
        
        # RAG response chain
        self.rag_chain = LLMChain(
            llm=self.llm,
            prompt=PromptTemplate(
                input_variables=["query", "context", "conversation_history"],
                template=RAG_RESPONSE_PROMPT
            ),
            verbose=True
        )
        
        # General response chain
        self.general_chain = LLMChain(
            llm=self.llm,
            prompt=PromptTemplate(
                input_variables=["query", "conversation_history"],
                template=GENERAL_RESPONSE_PROMPT
            ),
            verbose=True
        )

        self.staff_notification_class_chain = LLMChain(
            llm = self.llm,
            prompt = PromptTemplate(
                input_variables=['query'],
                template=STAFF_NOTIFYING_CLASSIFICATION_PROMPT
            )
        )

        self.notify_staff_chain = LLMChain(
            llm = self.llm,
            prompt = PromptTemplate(
                input_variables= ["query"],
                template= STAFF_NOTIFYING_PROMPT 
            )

        )

    def add_logs(self, segment: str, execution_time: float):
        with open('prompt_handling_logs.txt', mode='a') as file:
            file.write(f'{segment} execution: {execution_time}\n')

    async def handle_query(self, query: str, pinecone_client) -> str:
        # start_time = time.time()
        
        # Get conversation history
        conversation_history = self.memory.get_formatted_history()
        
        # Get context from Pinecone
        query_vector = self.embeddings.embed_query(query)
        # self.add_logs('Embedding Creation', time.time() - start_time)
        
        # start_time = time.time()
        initial_results = pinecone_client.query(
            vector=query_vector,
            top_k=config['pinecone_top_k'],
            include_metadata=True
        )
        # self.add_logs('Pinecone Query', time.time() - start_time)
        
        # Extract context
        context = "\n".join([
            match.metadata.get('text', '')
            for match in initial_results.matches
        ])
        
        # Classify query
        # start_time = time.time()
        classification = await self.classification_chain.arun(
            query=query,
            context=context,
            conversation_history=conversation_history,
            temperature=config['llm_temperature']
        )
        # self.add_logs('Classification', time.time() - start_time)

        print('classification decision:', classification)
        
        # Generate response based on classification
        # start_time = time.time()
        if "RAG_not_required" in classification:
            staff_notification_flag = await self.staff_notification_class_chain.arun(
                query=query
            )
            print('staff_notification_flag',staff_notification_flag)
            if "DONT_NOTIFY_STAFF" in staff_notification_flag:
                pass
            else:
                message_to_send_to_staff = await self.notify_staff_chain.arun(
                    query = query
                )
                send_message_to_staff(message = message_to_send_to_staff)

            response = await self.general_chain.arun(
                query=query,
                conversation_history=conversation_history
            )
        elif "RAG_required" in classification:
            response = await self.rag_chain.arun(
                query=query,
                context=context,
                conversation_history=conversation_history
            )
        
        else:
            response = "I apologize, but I need more information to help you properly. Could you please provide more details?"
            
        # self.add_logs('Response Generation', time.time() - start_time)
        
        # Add this exchange to conversation memory
        self.memory.add_exchange(query, response)
        
        return response, context

# Initialize the handler
handler = ChainOfThoughtHandler()

# Modified handle_query function to match your existing interface
def handle_query(query, pinecone_client=pinecone_client):
    import asyncio
    
    # Run the async handler in a synchronous context
    response, context = asyncio.run(handler.handle_query(
        query=query,
        pinecone_client=pinecone_client
    ))
    
    return response