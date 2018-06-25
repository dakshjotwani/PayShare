import React from 'react';
import {Jumbotron, Button, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle,} from 'reactstrap';
import './index.css';

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
		    The easy way to split expenses.
                    </p>
                    <p className="lead1">
                        <Button color="primary" size="lg"><strong>Get Started &#8594;</strong></Button>
                    </p>
                </Jumbotron>

		<div className="text-center" id="aboutus">
		    <h3 id="info-title"><strong> What we do </strong></h3>
		    <p className="text-left" id="info-text">
		    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
		    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
		    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
		    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
		    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
		    culpa qui officia deserunt mollit anim id est laborum.
		    </p>

		    <h3 id="info-title1"><strong> What we do </strong></h3>
		    <p className="text-right" id="info-text1">
		    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
		    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
		    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
		    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
		    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
		    culpa qui officia deserunt mollit anim id est laborum.
		    </p>
		</div>

		<div id="developers">
			 <Card id="leftcard">
        			<CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
        			<CardBody>
          				<CardTitle>Card title</CardTitle>
          				<CardSubtitle>Card subtitle</CardSubtitle>
          				<CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
        			</CardBody>
			</Card>
 
			 <Card id="rightcard">
        			<CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
        			<CardBody>
          				<CardTitle>Card title</CardTitle>
          				<CardSubtitle>Card subtitle</CardSubtitle>
          				<CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
        			</CardBody>
			</Card> 
		</div>
	    </div>
        );
    }
}
