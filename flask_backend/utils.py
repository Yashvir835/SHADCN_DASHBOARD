import fitz  # PyMuPDF
from pinecone.grpc import PineconeGRPC as Pinecone
from langchain.embeddings import HuggingFaceHubEmbeddings
import os
from dotenv import load_dotenv
from twilio.rest import Client
import yaml

import cv2
import pytesseract
import re
import base64
import tempfile


# Load existing config
with open('backend_configs.yaml') as f:
    config = yaml.safe_load(f)
load_dotenv('.env.local')

twilio_client = Client(os.environ.get('TWILIO_ACCOUNT_SID'),os.environ.get('TWILIO_AUTH_TOKEN'))


embedding_model_repo = 'nvidia/NV-Embed-v2'
embeddings = HuggingFaceHubEmbeddings(repo_id=embedding_model_repo,huggingfacehub_api_token=os.getenv('HUGGINGFACE_HUB_API_KEY'))


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

def decode_and_save_image(image_data):
    """Decode base64 image and save it as a temporary file."""
    try:
        # Decode base64
        image_bytes = base64.b64decode(image_data.split(",")[1])
        # Create a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        temp_file.write(image_bytes)
        temp_file.close()
        return temp_file.name
    except Exception as e:
        return str(e)

def flip_image(image_path):
    """Flip image horizontally (mirror it)."""
    image = cv2.imread(image_path)
    if image is None:
        return None
    flipped_image = cv2.flip(image, 1)  # Flip horizontally
    cv2.imwrite(image_path, flipped_image)
    return image_path


class Aadhar_OCR:
    def __init__(self, img_path):
        self.user_aadhar_no = str()
        self.user_gender = str()
        self.user_dob = str()
        self.user_name = str()

        self.img_name = img_path
    
    def extract_data(self):
        # Reading the image, extracting text from it, and storing the text into a list.
        img = cv2.imread(self.img_name)
        text = pytesseract.image_to_string(img)
        all_text_list = re.split(r'[\n]', text)
        
        # Process the text list to remove all whitespace elements in the list.
        text_list = list()
        for i in all_text_list:
            if re.match(r'^(\s)+$', i) or i=='':
                continue
            else:
                text_list.append(i)

        # Extracting all the necessary details from the pruned text list.
        # 1) Aadhar Card No.    
        aadhar_no_pat = r'^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$'
        for i in text_list:
            if re.match(aadhar_no_pat, i):
                self.user_aadhar_no = i
            else:
                continue

        # 2) Gender
        aadhar_male_pat = r'(Male|MALE|male)$'
        aadhar_female_pat = r'[(Female)(FEMALE)(female)]$'
        for i in text_list:
            if re.search('(Male|male|MALE)$', i):
                self.user_gender = 'MALE'
            elif re.search('(Female|FEMALE|female)$', i):
                self.user_gender = 'FEMALE'
            else:
                continue

        # 3) DOB
        aadhar_dob_pat = r'(Year|Birth|irth|YoB|YOB:|DOB:|DOB)'
        date_ele = str()
        for idx, i in enumerate(text_list):
            if re.search(aadhar_dob_pat, i):
                index = re.search(aadhar_dob_pat, i).span()[1]
                date_ele = i
                dob_idx = idx
            else:
                continue

        date_str=''
        for i in date_ele[index:]:
            if re.match(r'\d', i):
                date_str = date_str+i   
            elif re.match(r'/', i):
                date_str = date_str+i
            else:
                continue
        self.user_dob = date_str

        # 4) Name
        self.user_name = text_list[dob_idx-1]
        
        return [self.user_aadhar_no, self.user_gender, self.user_dob, self.user_name]


# if __name__ == '__main__':
#     print(extract_text_from_pdf('/Users/numair/Downloads/Airbnb_house_manual.pdf'))