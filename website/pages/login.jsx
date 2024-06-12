import {Footer, InsightCard, Navbar, TitleText, TypingText} from "../components";
import styles from "../styles";
import {motion} from "framer-motion";
import {fadeIn, staggerContainer} from "../utils/motion";
import {Notification, NotificationContainer} from "../components/Notification";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Page() {

    const [loadingMessage, setLoadingMessage] = useState('Loading...');
    const [error, setError] = useState("");
    const [returnUrl, setReturnUrl] = useState(null);
    const [notifications, setNotifications] = useState([]);


    // Get the return URL from the query string
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        setReturnUrl(returnUrl);
        setLoadingMessage('');
    }, []);


    // Login Function
    const login = async () => {
        setLoadingMessage('Logging in...');
        setError('');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        let data = JSON.stringify({
            "url": "https://www.paknsave.co.nz/CommonApi/Account/Login",
            "type": "post",
            "cookies": "",
            "data": {
                "email": email,
                "password": password
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/bypass',
            headers: {
                'Content-Type': 'application/json',
            },
            data : data
        };

        // Get the cookies from the login
        const response = await axios(config);
        console.log(response);

        //TODO Check if the login was successful
        // if (response.data.data.statusCode == 401) {
        //     addNotification('ERROR: Invalid login credentials');
        //     setLoadingMessage('');
        //     return;
        // }

        setLoadingMessage('Login successful');

        const cookies =  response.data.cookies;

        // Loop through the cookies to find the session
        for (let i = 0; i < cookies.length; i++) {

            const cookie = cookies[i];

            console.log(cookie)
            if (cookie.name = 'SessionCookieIdV2') {

                document.cookie = `SessionCookieIdV2=${cookie.value}; expires=${cookie.expiry}; Secure; SameSite=None`;
            }
        }


        // Redirect to the returnUrl
        window.location.href = returnUrl ? returnUrl : '/';

    };

    const addNotification = (text, type = 'success') => {
        const notification = {
            id: Math.random(),
            text,
            type,
        }
        setNotifications(prevState =>
            [...prevState, notification]
        );

        // set timeout to remove
        setTimeout(() => {
            setNotifications(prevState =>
                prevState.filter((notification) => notification.id !== notification.id)
            );
        }, 3000);
    }


    return (
        <>
            {/* Loading Overlay */}
            {loadingMessage &&
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 1000,
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2rem',

                    }}
                >
                    <img src="/book-loading.gif" alt="Loading" style={{width: '100px', height: '100px'}}/>
                    <p> {loadingMessage} </p>
                </div>
            }

            {/* Primary Page Layout */}
            <div className="bg-primary-black overflow-hidden">
                <Navbar/>
                <div className="relative" style={{height: 'calc(100vh - 80px)'}}>
                    <section className={`${styles.paddings} relative z-10 flex flex-col justify-center items-center gap-8`}>
                        <img src="/paknsave.webp" alt="login" className="w-[40%] object-contain"/>
                        <br/><br/>
                        <h1 className="text-white font-bold" style={{fontSize: "3.5rem"}}>Login</h1>
                        <h3 className="text-white text-lg font-light mt-4">Login with your Pak N Save account to link
                            carts</h3>

                        <div className="flex flex-col gap-4 mt-8" style={{width: '75%'}}>
                            <input id="email" type="email" placeholder="Email" className="p-4 border border-white bg-transparent text-white w-[400px]" style={{borderBottom : '1px solid white'}}/>
                            <input id="password" type="password" placeholder="Password"
                                   className="p-4 border border-white bg-transparent text-white" style={{borderBottom : '1px solid white'}}/>
                            <button className="p-4 text-primary-black font-bold hover:bg-primary-black hover:text-white transition-all" onClick={login} style={{background: "#94C47D"}}>Login</button>
                        </div>
                    </section>
                    <div className="gradient-04 z-0"/>
                </div>
                <Footer/>
            </div>

            <NotificationContainer position={"bottom"}>
                {notifications &&
                    notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            notification={notification}
                            notifications={notifications}
                            setNotifications={setNotifications}
                        />
                    ))}
            </NotificationContainer>
        </>
    );
}