
## client

npx create-react-app .
npm install react-icons --save
npm install socket.io-client

## server

npm init -y;
npm install express socket.io
npm install cors

## 실시간 채팅 구현

### 개요

Node.js를 서버로 사용하여 Socket.io를 활용한 실시간 채팅 기능을 구현했습니다.  
Socket.io를 선택한 주된 이유는 이 기능을 구현하기 위해 조사한 결과,  
Socket.io를 사용한 다양한 예시가 많이 나와있었고, server와 client의 양방향 소통이 가능한 라이브러리라는 것을 알게 되었습니다.  
또한 client와 server 간 연결이 끊어지는 경우 자동 재연결 기능을 제공하여 문제가 발생하는 경우를 없앨 수 있었습니다.

<details>
  <summary>client</summary>

### client

npm install socket.io-client

### 구현

client > components > contents > Chat.jsx

```js
// 소켓과 연결 : socket.io-client을 사용하여 서버와의 WebSocket 연결을 설정하여 데이터를 주고받도록 함
const socket = io("http://localhost:5051");

// 데이터 저장 변수
const [message, setMessage] = useState("");
const [chat, setChat] = useState([]);
const user = useSelector((state) => state.user); // redux를 사용하여 유저정보를 불러옴

// 채팅 메세지 수신 설정 : socket.on('chat message', callback)을 사용하여 'chat message'
// 이벤트 리스너를 설정합니다. 받은 메세지는 setChat 함수를 통해 chat 배열 상태에 추가되며, 이것은 UI에 표시됩니다.
useEffect(() => {
  socket.on("chat message", (msg) => {
    setChat((prevChat) => [...prevChat, msg]);
  });
  return () => socket.off("chat message");
}, []);

// 이전 채팅 불러오기 : 새로고침을 하면 기존 채팅이 사라져서 loadMessages 함수를 호출하여
// 서버에서 이전 채팅 메시지를 불러옵니다. loadMessages는 fetch를 사용해 서버의 /api/chat/getMessages
// 엔드포인트로부터 이전 채팅 메시지를 가져옵니다.
useEffect(() => {
  const loadMessages = async () => {
    try {
      const response = await fetch(
        "http://localhost:5051/api/chat/getMessages"
      );
      const data = await response.json();
      setChat(data);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };
  loadMessages();
}, []);

// 메세지 전송 : sendMessage함수를 정의하여 메세지를 전송합니다.
// 전송하는 데이터는 messageData로 username, message, photoURL을 포함하고 있습니다.
// socket.emit을 통해 데이터가 서버로 전송됩니다.
const sendMessage = (e) => {
  e.preventDefault();
  console.log("Current user:", user);

  if (message !== "") {
    const messageData = {
      username: user.displayName,
      message: message,
      photoURL: user.photoURL,
    };
    socket.emit("chat message", messageData);
    setMessage("");
  }
};
```

</details>
<details>
<summary>server</summary>

### server

npm install express socket.io

server > index.js

```js
// CORS를 설정 후 서버에 Socket.IO를 연결, localhost:3000에서 실행되는 클라이언트 애플리케이션이
// localhost:5051에서 호스팅되는 서버에 접근할 수 있게 합니다. 해당 과정이 없으면 CORS에러가 발생
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 채팅 메세지 이벤트 처리 : client로 부터 메세지를 수신할 때마다 실행되는 소스로 msg에는 client에서 보낸 정보가 들어있습니다.
// 데이터가 다 들어오기 전에 실행되는 것을 방지하기위해 async / await을 사용하여 비동기적으로 실행하도록 하였습니다.
// 혹시모를 에러를 찾기위해 try와 catch를 사용하여 에러의 이유를 파악하기 쉽게 하였습니다.
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
  socket.on("chat message", async (msg) => {
    try {
      const newMessage = new Message({
        username: msg.username,
        message: msg.message,
        photoURL: msg.photoURL,
      });
      await newMessage.save();
      io.emit("chat message", newMessage);
    } catch (error) {
      console.error("Message save error", error);
    }
  });
});
```

server > router > chat.js

```js
// 메세지 저장 : client에서 받은 req.body를 db에 저장
router.post("/message", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).send(newMessage);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 메세지 불러오기 : db에 저장된 데이터를 find를 사용하여 찾고, sort를 사용하여 오름차순으로 정렬
router.get("/getMessages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

</details>

### 트러블 슈팅

<details>
<summary>메시지 전송 및 수신 실패</summary>

- 문제  
  client에서 server로 데이터를 보내거나 반대로 server에서 client로 데이터를 보낼 때,  
  네트워크 등의 문제로 느리게 보내지거나 안보내질 때가 있었습니다.

- 해결  
  데이터를 보내거나 받는 부분에서 async / await을 이용한 비동기방식을 사용하여,  
  비교적 느리게 데이터를 받았을 때도 데이터가 없다는 오류가 뜨지 않도록했습니다.  
  이로인해 데이터가 늦어서 없다고 뜨는 것인지, 아니면 다른 문제로 데이터가 없는 것인지 구분이 가능하게 되었습니다.

</details>

<details>
<summary></summary>

</details>

## api를 활용하여 보호소 찾기
