<?php

namespace Neoan3\Components;


use Neoan3\Frame\Vastn3;

/**
 * Class some
 * @package Neoan3\Components
 */
class StripeCard extends Vastn3
{

    function init()
    {
        try{

            $stripeCredentials = getCredentials()['vastn3_stripe'];
        } catch (\Exception $e){
            var_dump('please set up credentials for stripe (see readme)');
            die();
        }
        $this
            ->includeJs('https://js.stripe.com/v3/')
            ->includeJs(base . 'component/stripeCard/demo.js',['renderMe'=>true])
            ->hook('main','stripeCard')
            ->vueComponent('stripeCard', ['stripePublicKey'=>$stripeCredentials['publicKey']])
            ->output();
    }

    /**
     * @var array of dependencies as strings
     * NOTE: only global params can be passed in
     */
    private static $requiredComponents = [];

    /**
     * This function is called by the vast-n3 frame
     *
     * @return array
     */
    static function dependencies()
    {
        return self::$requiredComponents;
    }
}

