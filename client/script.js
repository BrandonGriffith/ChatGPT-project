import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chat_container = document.querySelector('#chat_container');

let loadInterval;

function loader(e) {
    e.textContent = '';
    loadInterval = setInterval( () => { e.textContent != '....' ? e.textContent += '.' : e.textContent = '' }, 300);
};

function typeText(e, text) {
    let index = 0;
    let interval = setInterval( () => {
        if (index < text.length) {
            e.innerHTML += text.chartAt(index);
            index += 1;
        } else {
            clearInterval(interval);
        }
    }, 20 );
}

function generateId() {
    const timestamp = Date.now();
    const ranNum = Math.random().toString(16);
    return `id-${timestamp}-${ranNum}`;
}

function chatStripe(isAi, value, id) {
    return (
        `
        <div class='wrapper ${isAi && 'ai'}>
            <div class='chat'>
                <div class='profile'>
                    <img
                        src='${isAi ? bot : user}'
                        alt='${isAi ? 'bot' : 'user'}'
                    />
                </div>
                <div class='message' id='${id}'>
                    ${value}
                </div>
            </div>
        </div>
        `
    )
}

async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(form);
    chat_container.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();
    const id = generateId();
    chat_container.innerHTML += chatStripe(true, ' ', id);
    chat_container.scrollTop = chat_container.scrollHeight;
    const message = document.getElementById(id);
    loader(message);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => e.keyCode == 13 && handleSubmit(e));