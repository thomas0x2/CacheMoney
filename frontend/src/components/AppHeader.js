import './AppHeader.css'
import Scrolldown from "./Scrolldown";

export default function AppHeader() {
    return (
        <header className="App-Header">
            <p className="Title">Welcome to VIScon 2024</p>
            <span className="Spacer"/>
            <img src="/hexagon.png" className="Logo" alt="logo"/>
            <span className="Spacer"/>
            <span className="Spacer"/>
            <p className="Text">
                Hello Hackers!<br/><br/>
                We've provided you with an example app to get you started quickly. Feel free to change anything
                you'd like or yeet it completely. <a className="Link" href="https://gitlab.ethz.ch/vseth/1100-fv/1116-vis/vc2/sip-vis-vc2-hackathon/template">Link</a> to the Gitlab repository.
                <br/><br/>Cheers!<br/>Your Hackathon Team
            </p>
            <span className="Spacer"/>

            <Scrolldown/>
        </header>
    )
}
