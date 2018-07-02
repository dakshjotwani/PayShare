import React from 'react';
import {Jumbotron, Button, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle} from 'reactstrap';
import './index.css';
import {Link} from 'react-router-dom';
import Typed from 'react-typed';

/**
 * Landing page for web app
 */
export default class Landing extends React.Component {
    /**
     * Renders landing page
     * @return {object} Landing page
     */
    render() {
    return (
            <div>
                <Jumbotron fluid className="head">
                    <h1 className="display-3">PayShare</h1>
                    <p className="lead">
            The easy way to&nbsp;
                    <Typed
                        strings={[
                            'split bills.',
                            'manage expenses.',
                            'create groups.',
                            'ease life.']}
                        typeSpeed={30}
                        backSpeed={50}
                        loop
                    />
                    </p>
                    <p className="lead1">
                        <Button color="primary" size="lg" tag={Link}
            to="/signin"><strong>Get Started &#10132;</strong></Button>
                    </p>
                </Jumbotron>

        <div className="text-center" id="aboutus">
            <h3 id="info-title">Split Bills Easily</h3>
            <p className="text-left" id="info-text">
            You go out a lot. You shouldn&apos;t waste your time
            deciding who pays for what and how much. You deserve
            PayShare so we made it for you. Enjoy!
            </p>

            <h3 id="info-title1">Track Your Expenses</h3>
            <p className="text-right" id="info-text1">
            Get an overview on how much you&apos;ve spent going
            out to eat. You can quickly scan through your expenses
            or get an in depth overview on individual spendings.
            </p>

            <h3 id="info-title">Make Groups With Friends</h3>
            <p className="text-left" id="info-text">
            Form groups with your friends in order to save time
            when splitting expenses. Choose a groups from the
            expense section to make your life easy!
            </p>
        </div>

        <div id="developers">
            <h3 id="devs"> Meet our Developers! </h3>
            <Card id="leftcard">
                    <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                    <CardBody>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>Some quick example text to build on the card
                        title and make up the bulk of the card&apos;s content.
                        </CardText>
                    </CardBody>
            </Card>

             <Card id="rightcard">
                    <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                    <CardBody>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>Some quick example text to build on the card
                        title and make up the bulk of the card&apos;s content.
                         </CardText>
                    </CardBody>
            </Card>

            <Card id="leftcard">
                     <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                    <CardBody>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>Some quick example text to build on the card
                        title and make up the bulk of the card&apos;s content.
                        </CardText>
                    </CardBody>
            </Card>

             <Card id="rightcard">
                    <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                    <CardBody>
                        <CardTitle>Card title</CardTitle>
                        <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>Some quick example text to build on the card
                        title and make up the bulk of the card&apos;s content.
                         </CardText>
                    </CardBody>
            </Card>
        </div>
        </div>
        );
     }
}
