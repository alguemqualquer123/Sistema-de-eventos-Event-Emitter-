# 🎯 Event Emitter

Sistema de eventos (Event Emitter) robusto e performático, implementando o padrão Pub/Sub sem uso de bibliotecas externas.

## 📋 Características

- ✅ Padrão Pub/Sub completo
- ✅ Suporte a múltiplos listeners por evento
- ✅ Execução única com `once()`
- ✅ Gerenciamento automático de memória
- ✅ Alta performance
- ✅ Zero dependências
- ✅ TypeScript e JavaScript
- ✅ Compatível com Node.js e Browser

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/alguemqualquer123/Sistema-de-eventos-Event-Emitter-.git

# Entre no diretório
cd event-emitter
```

## 📖 Uso

### JavaScript

```javascript
const { EventEmitter } = require('./EventEmitter.js');

const emitter = new EventEmitter();

// Adicionar listener
emitter.on('message', (data) => {
  console.log('Recebido:', data);
});

// Emitir evento
emitter.emit('message', 'Olá, mundo!');

// Listener único
emitter.once('init', () => {
  console.log('Inicializado apenas uma vez');
});

// Remover listener
const handler = (data) => console.log(data);
emitter.on('data', handler);
emitter.off('data', handler);
```

### TypeScript

```typescript
import { EventEmitter } from './EventEmitter';

const emitter = new EventEmitter();

emitter.on('user:login', (userId: string) => {
  console.log(`Usuário ${userId} logou`);
});

emitter.emit('user:login', '12345');
```

## 🔧 API

### `on(eventName, listener)`

Adiciona um listener para o evento especificado.

**Parâmetros:**
- `eventName` (string): Nome do evento
- `listener` (function): Função callback a ser executada

**Retorna:** `this` (para encadeamento)

```javascript
emitter.on('data', (value) => {
  console.log(value);
});
```

### `off(eventName, listener)`

Remove um listener do evento especificado.

**Parâmetros:**
- `eventName` (string): Nome do evento
- `listener` (function): Função a ser removida

**Retorna:** `this` (para encadeamento)

```javascript
const handler = (data) => console.log(data);
emitter.on('data', handler);
emitter.off('data', handler);
```

### `once(eventName, listener)`

Adiciona um listener que será executado apenas uma vez.

**Parâmetros:**
- `eventName` (string): Nome do evento
- `listener` (function): Função callback

**Retorna:** `this` (para encadeamento)

```javascript
emitter.once('ready', () => {
  console.log('Sistema pronto!');
});
```

### `emit(eventName, ...args)`

Emite um evento, executando todos os listeners registrados.

**Parâmetros:**
- `eventName` (string): Nome do evento
- `...args` (any[]): Argumentos passados aos listeners

**Retorna:** `boolean` (true se havia listeners, false caso contrário)

```javascript
emitter.emit('update', { id: 1, name: 'Item' });
```

### `removeAllListeners(eventName?)`

Remove todos os listeners de um evento específico ou de todos os eventos.

**Parâmetros:**
- `eventName` (string, opcional): Nome do evento

**Retorna:** `this`

```javascript
emitter.removeAllListeners('data');
emitter.removeAllListeners(); // Remove todos
```

### `listenerCount(eventName)`

Retorna o número de listeners registrados para um evento.

**Parâmetros:**
- `eventName` (string): Nome do evento

**Retorna:** `number`

```javascript
const count = emitter.listenerCount('message');
```

### `eventNames()`

Retorna um array com os nomes de todos os eventos que possuem listeners.

**Retorna:** `string[]`

```javascript
const events = emitter.eventNames();
console.log(events); // ['message', 'data', 'ready']
```

## 🧪 Testes

Execute os testes para verificar a funcionalidade:

```bash
node EventEmitter.test.js
```

Todos os testes devem passar com sucesso ✅

## 💡 Exemplos de Uso

### Sistema de Notificações

```javascript
const emitter = new EventEmitter();

emitter.on('notification', (message) => {
  console.log(`📢 ${message}`);
});

emitter.on('notification:error', (error) => {
  console.error(`❌ Erro: ${error}`);
});

emitter.emit('notification', 'Novo usuário registrado');
emitter.emit('notification:error', 'Falha na conexão');
```

### Event Bus para Aplicação

```javascript
class AppEventBus extends EventEmitter {
  constructor() {
    super();
    this.setupDefaultHandlers();
  }

  setupDefaultHandlers() {
    this.on('app:start', () => console.log('App iniciado'));
    this.on('app:error', (err) => console.error('Erro:', err));
  }
}

const bus = new AppEventBus();
bus.emit('app:start');
```

### Chat em Tempo Real

```javascript
const chatEmitter = new EventEmitter();

chatEmitter.on('message', (user, text) => {
  console.log(`${user}: ${text}`);
});

chatEmitter.on('user:join', (user) => {
  console.log(`${user} entrou no chat`);
});

chatEmitter.on('user:leave', (user) => {
  console.log(`${user} saiu do chat`);
});

chatEmitter.emit('user:join', 'SR VINIX');
chatEmitter.emit('message', 'SR VINIX', 'Olá pessoal!');
```

## 🎯 Recursos Avançados

### Encadeamento de Métodos

```javascript
emitter
  .on('start', () => console.log('Iniciando...'))
  .on('progress', (percent) => console.log(`${percent}%`))
  .on('complete', () => console.log('Completo!'))
  .emit('start');
```

### Gerenciamento de Memória

O EventEmitter gerencia automaticamente a memória, removendo listeners quando não há mais referências e limpando eventos vazios.

```javascript
const handler = () => console.log('test');
emitter.on('test', handler);
emitter.off('test', handler); // Evento 'test' removido automaticamente
```

## 📊 Performance

- **Operações O(1)**: Adicionar e emitir eventos
- **Memória otimizada**: Remoção automática de eventos sem listeners
- **Zero overhead**: Sem dependências externas
- **Cópia defensiva**: Listeners são copiados antes da execução para evitar bugs

## 🛡️ Prevenção de Memory Leaks

O sistema implementa várias estratégias para prevenir vazamento de memória:

1. Remoção automática de eventos vazios
2. Método `once()` remove o listener automaticamente após execução
3. Método `removeAllListeners()` para limpeza em massa
4. Uso de `Map` para performance e gerenciamento eficiente

## 📝 Licença

MIT License

Copyright (c) 2025 SR VINIX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 👤 Autor

**SR VINIX**
- GitHub: [@alguemqualquer123](https://github.com/alguemqualquer123)

## 🤝 Contribuindo

Contribuições, issues e feature requests são bem-vindos!

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## ⭐ Mostre seu apoio

Se este projeto foi útil para você, dê uma ⭐!

---

Desenvolvido com ❤️ por [SR VINIX](https://github.com/alguemqualquer123)
