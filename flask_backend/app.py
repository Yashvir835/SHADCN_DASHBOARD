from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile
from pydub import AudioSegment
from pydub.playback import play
from context_aware_prompt_handler import handle_query
import warnings
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from pydub.playback import play
import tempfile

def play_audio(file_storage):
    with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as temp_audio_file:
        file_storage.save(temp_audio_file.name)
        temp_audio_file.seek(0)
        audio = AudioSegment.from_file(temp_audio_file.name)
        play(audio)

warnings.filterwarnings('ignore')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load Whisper model
model = whisper.load_model("base")

@app.route("/experience-avatar", methods=["GET"])
def create_experience():
    try:
        # Get parameters from the request
        user_id = request.args.get('userId')
        business = request.args.get('business')
        avatar_name = request.args.get('avatarName')
        image = request.args.get('image')
        voice = request.args.get('voice')
        user_email = request.args.get('userEmail')

        # if not all([user_id, business, avatar_name, image, voice, user_email]):
        #     return jsonify({
        #         "error": "Missing required parameters"
        #     }), 400

        # Process the request and generate redirect URL
        # You can customize this based on your needs
        # redirect_url = f"http://localhost:5000/avatar-experience/{business}/{avatar_name}"
        redirect_url = f"http://localhost:3000/interactive-avatar"

        return jsonify({
            "redirectUrl": redirect_url,
            "message": "Success"
        })

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "error": f"Error processing request: {str(e)}"
        }), 500

@app.route("/chat", methods=["POST"])
def chat():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files["audio"]

        if not audio_file:
            return jsonify({"error": "Invalid audio file"}), 400
        filename = secure_filename(audio_file.filename)
        temp_audio_path = os.path.join("./temp", filename)
        os.makedirs(os.path.dirname(temp_audio_path), exist_ok=True)
        audio_file.save(temp_audio_path)
        
        print("Audio file saved successfully.")

        transcription_result = model.transcribe(temp_audio_path)
        transcription = transcription_result["text"]

        response = handle_query(query=transcription)
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500

    return jsonify({"transcription": transcription, "response": response})

@app.route("/text_chat", methods=["POST"])
def text_chat():

    try:
        # Directly parse JSON input
        data = request.get_json()
        user_input = data.get('message')
        print(data)


        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Process the query
        response = handle_query(query=user_input)

        return jsonify({
            "user_input": user_input, 
            "response": response
        })
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=False, port=5000,threaded = True)