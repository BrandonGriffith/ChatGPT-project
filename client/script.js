import bot from './assets/bot.svg';
import user from './assets/user.svg';

const chatForm = document.querySelector('#chat_form');
const chatContainer = document.querySelector('#chat_container');
document.getElementById('prompt').focus();

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
        chatContainer.scrollTop = chatContainer.scrollHeight;
        if (index < text.length) {
            e.innerHTML += text.charAt(index);
            index += 1;
        } else {
            clearInterval(interval);
        }
    }, 10);
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
            <div class="message" id="${id}">${value}</div>
        </div>
    </div>
    `;

let passKey;

const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById('prompt').focus();

    const data = new FormData(chatForm);
    const id_user = generateId();
    const id_ai = generateId();

    if (!passKey) {
        setTimeout(() => {
            chatForm.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    handleSubmit(e);
                };
            });
        }, 1000);
        passKey = document.getElementById('passKey').value;
        // passKey = document.getElementById('passKey').value.replace(/\s/g, '');
        document.getElementById('passKey').remove();
    };

    let userMessage = data.get('prompt');
    chatContainer.innerHTML += chatStripe(false, userMessage, id_user);
    chatContainer.innerHTML += chatStripe(true, ' ', id_ai);

    chatForm.reset();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const message = document.getElementById(id_ai);
    loader(message);

    const response = await fetch(import.meta.env.VITE_SERVERURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt'),
            model: 'gpt-3.5-turbo',
            passKey
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

chatForm.addEventListener('submit', handleSubmit);
