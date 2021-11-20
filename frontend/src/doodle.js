import React, {useState, useEffect} from 'react';
import Axios from 'axios';

let url = `http://${window.location.hostname}`


//Header Bar at the top of the page
class Header extends React.Component{
    render(){
        return (
            <div id = 'header'>
                <div id = "header_App">Doodle</div>
                <div id = "header_SpaceAL"></div>
                <div id = "header_Login" onClick = {()=>{
                    if (document.getElementById("loginForm").style.display == "none"){
                        document.getElementById("loginForm").style.display = "block";
                    }
                    else 
                        document.getElementById("loginForm").style.display = "none";
                }} >Login</div>

                <div id = "header_Name">Admin</div>                
                <div id = "header_Guest" onClick = {() =>{ //this closes or opens header form
                    if (document.getElementById("guestForm").style.display == "none"){
                        document.getElementById("guestForm").style.display = "block";
                    }
                    else 
                        document.getElementById("guestForm").style.display = "none";
                }}>Guest</div>

               <div id = "header_CloseDoodle" onClick = {()=>{ //this closes or opens doodle list
                    if (document.getElementById("cards_container").style.display == "none"){
                        document.getElementById("cards_container").style.display = "grid";
                    }
                    else 
                        document.getElementById("cards_container").style.display = "none";
               }}>Current Doodles</div>
            </div>

        );
    }
}

function NameBar(){
    const signOut = () =>{
        Axios.put(`${url}/api/signout`, {  //calls the backend to sign out and then sets the admin function to display
        }).then(()=>{
            document.getElementById("header_bottom").style.display = "none";
            document.getElementById("admin_page").style.display = "none";
        });
    };
    return(<div id = "header_bottom">
                <div id = "header_name">
                    Hello Admin
                </div>
                <div id = "header_spaceNS">
                    
                </div>
                <div id = "header_signout" onClick = {signOut}>
                    SignOut
                </div>
            </div>
    );
}


//login function
function Login(){
    const [loginData, setLoginData] = useState(''); //account data from database

    const [userName, setUsername] = useState(''); //username data
    const [passWord, setPassword] = useState(''); //password data

    useEffect(() =>{ //gets the times available by accessing the doodle time database
        Axios.get(`${url}/api/getAdmin`).then((response) =>{  //gets all the doodles
              setLoginData(response.data);
          })
    }, [])  //calls the backend to send all the admin user data and sets to setLoginData


    const loggedIn = () =>{
        Axios.put(`${url}/api/loggedin`, {
        }).then(()=>{
        });  //calls the back end to login
    };
    function checkUser(){  //checks if the credentials matches the admin credentials
        return(
          loginData.map((val) =>{
            if (userName == val.adminName && passWord == val.adminPass){
              loggedIn();
            }
          }
        ));
    }

    return(
        <div id = "loginForm"> 
            <form>
                Username:
                <input id = 'adminName' name = 'userName' placeholder = 'Username' type = 'text' onChange = {(e) =>{
                    setUsername(e.target.value);
                }}/>
                <br/><br/>

                Password:
                <input id = 'adminPass' name = 'password' placeholder = 'Password' type = 'text' onChange = {(e) =>{
                    setPassword(e.target.value);
                }}/>
                <br/><br/>

                <button onClick = {checkUser}>Login</button>
            </form>

        </div>
    );
}

//admin functions
function Admin(){ //adminFunction
    const [timeId, setTimeID] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    const submitUpdate = () =>{  //submits the update and sends the current changes on the id, and times
        Axios.put(`${url}/api/updateTime`, {
            timeId: timeId,
            startTime: startTime,
            endTime: endTime
        }).then(()=>{
        });
    };
    return(
        <div id ="admin_page">
            <form>
                                        
                    Edit Doodle Times:
                    <br/><br/>
                    <label htmlFor = "timeID">Doodle ID</label>
                    <input id = 'time_id' name = 'timeID' placeholder = 'Time ID' type = 'text' onChange ={(e) =>{
                        setTimeID(e.target.value);
                    }}/>
                    <br/>
                    <label htmlFor = "startTime">Start Time</label>
                    <input id = 'start_time' name = 'startTime' type = 'time' onChange ={(e) =>{
                        setStartTime(e.target.value);
                    }}/>
                    <br/>
                    <label htmlFor = "endTime">End Time</label>
                    <input id = 'end_time' name = 'endTime' type = 'time' onChange ={(e) =>{
                        setEndTime(e.target.value);
                    }}/>
                    <br/><br/>
                    
                    <button onClick = {submitUpdate}>Submit</button>
            </form>
        </div>
    );
}

//guest functions
function Guest(){
    const [doodleTime, setDoodleTime] =  useState([]); //times available
    let radioid = "times";
    var timeData = "";

    const [guestName, setGuestName] = useState([]);


    //when submit is triggered, the guestName, doodle and date is sent to the database
    const submitGuest = () =>{
        Axios.post(`${url}/api/insert`, {
            guestName: guestName, 
            timeData: timeData
        }).then(()=>{

        });
    };
    useEffect(() =>{ //gets the times available by accessing the doodle time database
        Axios.get(`${url}/api/getDoodles`).then((response) =>{  //gets all the doodles
              setDoodleTime(response.data);
          })
    }, [])

    //sets times
    //Gets the radio buttons, if checked then it takes the inner html and puts it in a string
    //then with the submit guest function it sends to the database.
    function setTimes(){
        let classTime = document.getElementsByClassName("time");
        let timeLabel = document.getElementsByClassName("timeLabel")
        for (let i = 0; i<10; i++){
            if(classTime[i].checked){
                timeData += "\n"+timeLabel[i].innerHTML
            }
        }
        submitGuest();
    }

    return(
            
        <div id = "guestForm">
            <form >
                    <label htmlFor = "guestName">What's your name?</label>
                    <input id = 'guestName' name = 'guestName' type = 'text' onChange ={(e) =>{
                        setGuestName(e.target.value);
                    }}/>
                    <br/><br/>
                    <p>What times are you available?</p>
                    {doodleTime.map((val) =>{   //shows the current doodles
                        return (<div>
                            <input className = "time" type="radio"/>
                            <label className = "timeLabel">{val.startTime + " - " + val.endTime}</label>
                        </div>);
                    })}
                    <br/>
                    <br/>
                    <input type = "submit" onClick = {setTimes}/>
                </form>
            </div>
            
        );
}

class Doodle extends React.Component{
    render(){
        return(
            <div>
                <Header/>
                <NameBar/>
                <div id = "welcomeMessage">
                    Welcome to Doodle
                </div>
                <Login/>
                <Admin/>
                <Guest/>

            </div>
        );
    }
}

export default Doodle;