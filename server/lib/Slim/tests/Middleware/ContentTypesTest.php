<?php
/**
 * Slim - a micro PHP 5 framework
 *
 * @author      Josh Lockhart <info@slimframework.com>
 * @copyright   2011 Josh Lockhart
 * @link        http://www.slimframework.com
 * @license     http://www.slimframework.com/license
 * @version     2.6.1
 *

 */

class ContentTypesTest extends PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        ob_start();
    }

    public function tearDown()
    {
        ob_end_clean();
    }

    /**
     * Test parses JSON
     */
    public function testParsesJson()
    {
        \Slim\Environment::mock(array(
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => 'application/json',
            'CONENT_LENGTH' => 13,
            'slim.input' => '{"foo":"bar"}'
        ));
        $s = new \Slim\Slim();
        $s->add(new \Slim\Middleware\ContentTypes());
        $s->run();
        $body = $s->request()->getBody();
        $this->assertTrue(is_array($body));
        $this->assertEquals('bar', $body['foo']);
    }

    /**
     * Test ignores JSON with errors
     */
    public function testParsesJsonWithError()
    {
        \Slim\Environment::mock(array(
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => 'application/json',
            'CONENT_LENGTH' => 12,
            'slim.input' => '{"foo":"bar"' //<-- This should be incorrect!
        ));
        $s = new \Slim\Slim();
        $s->add(new \Slim\Middleware\ContentTypes());
        $s->run();
        $body = $s->request()->getBody();
        $this->assertTrue(is_string($body));
        $this->assertEquals('{"foo":"bar"', $body);
    }

    /**
     * Test parses XML
     */
    public function testParsesXml()
    {
        \Slim\Environment::mock(array(
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => 'application/xml',
            'CONENT_LENGTH' => 68,
            'slim.input' => '<books><book><id>1</id><author>Clive Cussler</author></book></books>'
        ));
        $s = new \Slim\Slim();
        $s->add(new \Slim\Middleware\ContentTypes());
        $s->run();
        $body = $s->request()->getBody();
        $this->assertInstanceOf('SimpleXMLElement', $body);
        $this->assertEquals('Clive Cussler', (string) $body->book->author);
    }

    /**
     * Test ignores XML with errors
     */
    public function testParsesXmlWithError()
    {
	libxml_use_internal_errors(true);
        \Slim\Environment::mock(array(
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => 'application/xml',
            'CONTENT_LENGTH' => 68,
            'slim.input' => '<books><book><id>1</id><author>Clive Cussler</book></books>' //<-- This should be incorrect!
        ));
        $s = new \Slim\Slim();
        $s->add(new \Slim\Middleware\ContentTypes());
        $s->run();
        $body = $s->request()->getBody();
        $this->assertTrue(is_string($body));
        $this->assertEquals('<books><book><id>1</id><author>Clive Cussler</book></books>', $body);
    }

    /**
     * Test parses CSV
     */
    public function testParsesCsv()
    {
        \Slim\Environment::mock(array(
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => 'text/csv',
            'CONTENT_LENGTH' => 44,
            'slim.input' => "John,Doe,000-111-2222\nJane,Doe,111-222-3333"
        ));
        $s = new \Slim\Slim();
        $s->add(new \Slim\Middleware\ContentTypes());
        $s->run();
        $body = $s->request()->getBody();
        $this->assertTrue(is_array($body));
        $this->assertEquals(2, count($body));
        $this->assertEquals('000-111-2222', $body[0][2]);
        $this->assertEquals('Doe', $body[1][1]);
    }

    /**
     * Test parses request body based on media-type only, disregarding
     * any extra content-type header parameters
     */
    public function testParsesRequestBodyWithMediaType()
    {
        \Slim\Environment::mock(array(
            'REQUEST_METHOD' => 'POST',
            'CONTENT_TYPE' => 'application/json; charset=ISO-8859-4',
            'CONTENT_LENGTH' => 13,
            'slim.input' => '{"foo":"bar"}'
        ));
        $s = new \Slim\Slim();
        $s->add(new \Slim\Middleware\ContentTypes());
        $s->run();
        $body = $s->request()->getBody();
        $this->assertTrue(is_array($body));
        $this->assertEquals('bar', $body['foo']);
    }
}
