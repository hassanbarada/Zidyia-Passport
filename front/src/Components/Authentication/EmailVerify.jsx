import axios from 'axios';
import React,{useState,useEffect,Fragment} from 'react'
import { Link,useParams } from 'react-router-dom';
import './EmailVerify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Bars } from 'react-loader-spinner';

function EmailVerify() {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();
    console.log(param.id)
    console.log(param.token)

    const api = 'http://localhost:3001'



    useEffect(() => {
        const verifyEmailUrl = async() => {
            try{
                const url = `${api}/users/${param.id}/verify/${param.token}`;
                const {data} = await axios.get(url);
                console.log(data);
                setValidUrl(true);
            }catch(error){
                console.log(error);
                setValidUrl(false);
            }
        };
        verifyEmailUrl()
    },[param])
  return (
    <Fragment>
        <div className='email-verify-container'>
            <div className='email-verify-container-content'>
        {validUrl ? (
            <>
            <h1><FontAwesomeIcon icon={faCheck}  /></h1>
            <h1>SUCCESS</h1>
            </>
        ): (
            <Bars
            height="250"
            width="250"
            color="#5DD3B3"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
        </div>
        </div>
    </Fragment>
  )
}

export default EmailVerify