import React, {useState} from 'react'
import {io} from 'socket.io-client'
import './App.css'
// import ReactTextFormat from 'react-text-format';

var markup,appendMesage,sendMessage
const socket=io.connect('http://localhost:4000')
let name
do{
  name=prompt("please enter ur name:")
}while(!name)
let textarea=document.querySelector('#textarea')



const handleEnter=(e)=>{
  if(e.key==='Enter'){
      sendMessage(e.target.value)
  }
}





// receiver message


socket.on('message',(msg)=>{
  appendMesage(msg, 'incoming')
  scrollToBottom()
})

const scrollToBottom = ()=> {
  let messageArea=document.querySelector('.message__area')
  messageArea.scrollTop=messageArea.scrollHeight}

const App = () => {

  var [bold , setBold]=useState(false)
var [italics , setItalics]=useState(false)
var [strike , setStrike]=useState(false)
var [link , setLink]=useState(false)
var [quote , setQuote]=useState(false)
   appendMesage=(msg,type)=>{
    let messageArea=document.querySelector('.message__area')
    let mainDiv=document.createElement('div')
    let className=type
    mainDiv.classList.add(className,'message')
    let chat=`<p>${msg.message}</p>`
    if(msg.bold===true) chat='<strong>'+chat+'</strong>'
    if(msg.italics===true) chat='<i>'+chat+'</i>'
    if(msg.strike===true) chat='<div class="striked">'+chat+'</div>'
    if(msg.link===true) chat=`<a href="https://${msg.message}">`+chat+'</a>'
    if(msg.quote===true) chat=`<p> "${msg.message}" </p>`
    markup=`
    <h4>${msg.user}</h4>
    ${chat}
    `
  
    mainDiv.innerHTML=markup
    messageArea.appendChild(mainDiv)
  
  }
  sendMessage=(message)=>{
    let textarea=document.querySelector('#textarea')
    
    let msg={
        user:name,
        message:message.trim(),
        bold:bold,
        italics:italics,
        strike:strike,
        link:link,
        quote:quote
  
    }
    //append
    appendMesage(msg,'outgoing')
    textarea.value=''
    scrollToBottom()
    //send to server
  
    socket.emit('message',msg)
  
  
  }

  return ( 
    <div>
      <section class="chat__section">
        <div class="brand">
            <img height="40" src="/whats.png" alt="" />
            <h1>Baatein</h1>
        </div>
        <div class="message__area"></div>
        <div id="inputArea">
          <div className="format">
          <div class="bold" onClick={()=>{
            bold?setBold(false):setBold(true) }}><img src="/bold.png" height="25" alt="" /></div>
                <div class="italic" onClick={()=>{
            italics?setItalics(false):setItalics(true) }}><img src="/italics.png" height="25" alt="" /></div>
                <div class="strike" onClick={()=>{
            strike?setStrike(false):setStrike(true) }}><img src="/strike.png" height="25" alt="" /></div>
                <div class="link" onClick={()=>{
            link?setLink(false):setLink(true) }}><img src="/link.png" height="25" alt="" /></div>
                <div class="quote" onClick={()=>{
            quote?setQuote(false):setQuote(true) }}><img src="/quote.png" height="25" alt="" /></div>
          </div>
            
            <textarea id="textarea" cols="30" rows="1" placeholder="Write a message..." onKeyUp={handleEnter}></textarea>
            <div className="send">
              <img src="/send.png" alt="" height="25" />
            </div>
        </div>
    </section>
    </div>
   );
}
 
export default App;