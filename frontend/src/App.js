import './App.css';
import Doodle from './doodle';
import Axios from 'axios';
import React, {useEffect, useState} from 'react';
let url = `http://${window.location.hostname}`


function App() {
  const [loginData, setLoginData] = useState([]);

  const [doodleList, setDoodleList] = useState([]);
  const [doodleTime, setDoodleTime] =  useState([]);


  //contacts the index.js for the api/get and gets the results.
      //Using the results it fills the doodlelist
  useEffect(() =>{
      Axios.get(`${url}/api/get`).then((response) =>{  //gets all the doodles

            setDoodleList(response.data);
        })
  }, [])
  useEffect(() =>{
    Axios.get(`${url}/api/getDoodles`).then((response) =>{  //gets all the doodles
          setDoodleTime(response.data);
      })
  }, [])

  useEffect(() =>{ //gets the times available by accessing the doodle time database
    Axios.get(`${url}/api/getAdmin`).then((response) =>{  //gets all the doodles
          setLoginData(response.data);
      })
  }, [])

  
  //login function
  function login(){
    return( //when logged in then the header and admin functionalities are visible
      loginData.map((val) =>{
        if (val.loggedIn == "1"){
          document.getElementById("header_bottom").style.display = "flex";
          document.getElementById("admin_page").style.display = "block";
        }
        else{
          document.getElementById("header_bottom").style.display = "none";
          document.getElementById("admin_page").style.display = "none";
        }
      }
    ));
  }
  login();
  
  const removeGuest = (gId) =>{  //Function sends a axios request with a id parameter then reloads when it is done
    alert(`${url}/api/delete/${gId}`);
    Axios.delete(`${url}/api/delete/${gId}`);  
    window.location.reload();
  };

  
  return (
    <div id="App">
      <Doodle/>
      
      <div id = "cards_border">
        <div>
          Guest Availability
        </div>
        <div id = "cards_container">
          
          {doodleList.map((val) =>{   //shows the current doodles
            return <div className = "doodle_cards">Guest Name: {val.guestName}<br/> Times Available: {val.guestTime}
                    <button className = "doodle_delete" onClick ={() =>{removeGuest(val.id)}}>Delete</button>
                   </div>
          })}
        </div>
      </div>

      <div id = "doodle_container">
        <div>
          Current Time Ranges
        </div>
        {doodleTime.map((val) =>{   //shows the current doodles
          return <div className = "doodle_time">ID: {val.timeId} | Start Time: {(val.startTime).slice(0,5)} | End Time: {(val.endTime).slice(0,5)}
            </div>
        })}
      </div>
    </div>
  );
}

export default App;
