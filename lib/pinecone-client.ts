import { Pinecone } from '@pinecone-database/pinecone';

// Hardcode the API key
const pc = new Pinecone({
    apiKey: 'pcsk_3gMomf_JaomPF6BFVVakgLqT52hXVNgnTrN6E9dQiYYGjRwHxxfAZZZwK3qoJk5GCMGxdY', // Replace with your actual API key
});

export default pc;
