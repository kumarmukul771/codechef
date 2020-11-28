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

class MyMiddleware extends \Slim\Middleware
{
    public function call() {}
}

class MiddlewareTest extends PHPUnit_Framework_TestCase
{
    public function testSetApplication()
    {
        $app = new stdClass();
        $mw = new MyMiddleware();
        $mw->setApplication($app);

        $this->assertAttributeSame($app, 'app', $mw);
    }

    public function testGetApplication()
    {
        $app = new stdClass();
        $mw = new MyMiddleware();
        $property = new \ReflectionProperty($mw, 'app');
        $property->setAccessible(true);
        $property->setValue($mw, $app);

        $this->assertSame($app, $mw->getApplication());
    }

    public function testSetNextMiddleware()
    {
        $mw1 = new MyMiddleware();
        $mw2 = new MyMiddleware();
        $mw1->setNextMiddleware($mw2);

        $this->assertAttributeSame($mw2, 'next', $mw1);
    }

    public function testGetNextMiddleware()
    {
        $mw1 = new MyMiddleware();
        $mw2 = new MyMiddleware();
        $property = new \ReflectionProperty($mw1, 'next');
        $property->setAccessible(true);
        $property->setValue($mw1, $mw2);

        $this->assertSame($mw2, $mw1->getNextMiddleware());
    }
}
