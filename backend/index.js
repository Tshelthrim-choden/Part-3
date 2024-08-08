const express= require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons',(request,response)=>{
    response.json(data)
})

app.get('/info',(request,response)=>{
    const requestTime= new Date();
    const infoLength= data.length;
   response.send(`<p>Phonebook have info for ${infoLength} people</p>
    <p>${requestTime}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id;
    const selectedData= data.find(data=> data.id===id);
    if(selectedData){
        response.json(selectedData)
    } else {
        response.status(404).send({error: 'Person Not found'})
    }

})

app.delete('/api/persons/:id',(request,response)=>{
const id=request.params.id;
const selectedData= data.find(data=>data.id===id);
    if(selectedData){
    response.status(204).end()
    } else {
    response.status(404).send({error: 'Person Not found'})
    }

})

app.post('/api/persons', (request, response) => {
    const newData = request.body;
  
    if (!newData.name || !newData.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      });
    }
  
    const isNameExist = data.some(person => person.name === newData.name);
    if (isNameExist) {
      return response.status(400).json({
        error: 'Name must be unique'
      });
    }
  
    const newId = Math.floor(Math.random() * 1000000);
    const newPerson = {
      id: newId,
      name: newData.name,
      number: newData.number
    };
  
    data.push(newPerson);
    response.json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(express.static('build'))