import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  const newFormData = new FormData();
  newFormData.append('audio', audioFile, 'audio.wav');

  try {
    const flaskResponse = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      body: newFormData,
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask API responded with status: ${flaskResponse.status}`);
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding request to Flask:', error);
    return NextResponse.json({ error: 'Error processing request ' + error}, { status: 500 });
  }
}