import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

const loader = (e) => {
    e.textContent = '';
    loadInterval = setInterval(() => {
        e.textContent !== '....' ? (e.textContent += '.') : (e.textContent = '');
    }, 300);
};

const typeText = (e, text) => {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            e.innerHTML += text.charAt(index);
            index += 1;
        } else {
            clearInterval(interval);
        }
    }, 20);
};

const generateId = () => {
    const timestamp = Date.now();
    const ranNum = Math.random().toString(16);
    return `id-${timestamp}-${ranNum}`;
};

const chatStripe = (isAi, value, id) =>
    `
    <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
            <div class="profile">
                <img
                    src="${isAi ? bot : user}"
                    alt="${isAi ? 'bot' : 'user'}"
                />
            </div>
            <div class="message" id="${id}">
                ${value}
            </div>
        </div>
    </div>
    `;

const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const id = generateId();

    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    chatContainer.innerHTML += chatStripe(true, ' ', id);

    form.reset();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const message = document.getElementById(id);
    loader(message);

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt'),
            model: 'gpt-3.5-turbo'
        })
    });

    clearInterval(loadInterval);
    message.innerHTML = '';

    if (response.ok) {
        const responseData = await response.json();
        const parsedData = responseData.bot.content.trim();
        typeText(message, parsedData);
    } else {
        const err = await response.text();
        message.innerHTML = 'Something went wrong';
        alert(err);
    }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSubmit(e);
    }
});
