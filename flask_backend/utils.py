import fitz  # PyMuPDF
# from sentence_transformers import SentenceTransformer
from pinecone.grpc import PineconeGRPC as Pinecone
# from pinecone import ServerlessSpec
from langchain.embeddings import HuggingFaceHubEmbeddings
import os
from dotenv import load_dotenv
from twilio.rest import Client
import yaml

# Load existing config
with open('backend_configs.yaml') as f:
    config = yaml.safe_load(f)
load_dotenv('.env.local')

twilio_client = Client(os.environ.get('TWILIO_ACCOUNT_SID'),os.environ.get('TWILIO_AUTH_TOKEN'))


embedding_model_repo = 'nvidia/NV-Embed-v2'
embeddings = HuggingFaceHubEmbeddings(repo_id=embedding_model_repo,huggingfacehub_api_token=os.getenv('HUGGINGFACE_HUB_API_KEY'))

# Initialize Sentence Transformer model for vectorization
# model = SentenceTransformer("embaas/sentence-transformers-multilingual-e5-large", trust_remote_code=True)

def send_message_to_staff(message = '',client = twilio_client):
    custom_message = message

    # Sending the message
    message = client.messages.create(
    from_='whatsapp:+14155238886',
    body=custom_message,  # Use the 'body' parameter for a custom message
    to='whatsapp:+917304104550'
    )

def text_to_vector(text='',model=embeddings):
    return model.embed_query(text)



class GroqLLM:
    """
    A simplified utility class for interacting with a Groq-based LLM endpoint.
    """

    def __init__(self, client, model="mixtral-8x7b-32768"):
        """
        Initialize the GroqLLM instance.

        :param client: The client object for interacting with the Groq API.
        :param model: The model to be used for completions.
        """
        self.client = client
        self.model = model

    def get_response(self, system_prompt_string, custom_prompt=""):
        """
        Generate a response using the Groq-based LLM.

        :param system_prompt_string: The system prompt string to define behavior.
        :param custom_prompt: The user's custom input.
        :return: The assistant's response text.
        """
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt_string
                },
                {
                    "role": "user",
                    "content": custom_prompt
                }
            ],
            temperature=1.5,
            max_tokens=1024,
            top_p=1,
            stream=False
        )
        return completion.choices[0].message.content



def extract_text_from_pdf(pdf_path):
    # Open the provided PDF file
    doc = fitz.open(pdf_path)
    full_text = ""
    
    # Extract text from each page
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        full_text += page.get_text()

    return full_text

# if __name__ == '__main__':
#     print(extract_text_from_pdf('/Users/numair/Downloads/Airbnb_house_manual.pdf'))