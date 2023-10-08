import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import APIForm from '../Components/APIForm';
import Gallery from '../Components/Gallery';

// a variable ACCESS_KEY 
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


function App() {

  // create a state variable to hold and diplay the current screenshot
  const [currentImage, setCurrentImage] = useState(null);

  const [prevImages, setPrevImages] = useState([]);
  
  // Add a set of intputs in state variable dictionary 
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  // Handling default values and Empty URL
  const submitForm = () => {
    // set default values 
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (inputs.url == "" || inputs.url == " ") {
      alert("You forgot to submit an url!");
    }else {
      for (const [key, value] of Object.entries(inputs)) { // similar for each loop ???
        if (value == "") {
          inputs[key] = defaultValues[key]
        }
      }
      makeQuery();

    }
  } 


  // assemble input into the right query string format that API call needs
  const makeQuery = () => {
      let wait_until = "network_idle";
      let response_type = "json";
      let fail_on_status = "400%2C404%2C500-511";
      let url_starter = "https://";
      let fullURL = url_starter + inputs.url;
      // assemble our query
      let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;  
      
      console.log("makeQuery is called ")
      
      callAPI(query).catch(console.error);
    }

  // Make the API call
  const callAPI = async (query) => { // turn into a asynchronouse function, always returns a promise
      const response = await fetch(query); // return a promise in pending state
      const json = await response.json();
      console.log(json);

      if (json.url == null) {
        alert("Oops! Something went wrong with that query, let's try again!")
      }
      else {
        setCurrentImage(json.url);
        setPrevImages((images) => [...images, json.url]);
        reset();
      }
  }

   // reset funtion 
  const reset = () => {
    // clear form after API call
      setInputs({
        url: "",
        format: "",
        no_ads: "",
        no_cookie_banners: "",
        width: "",
        height: "",
      });
  }


  return (
    <>
     <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>
      
      // APIForm Components with proper props
      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />

      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}

      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
        <Gallery images={prevImages} />
      </div>


    </div>
        
    </>
  )
}

export default App
