<?php

namespace AppBundle\Twig;

class AssetVersionExtension extends \Twig_Extension {
  private $appDir;

  public function __construct($appDir){
    $this->appDir = $appDir;
  }

  public function getFilters(){
    return array(
      new \Twig_SimpleFilter('asset_version', array($this, 'getAssetVersion'))    
    );
  }

  public function getAssetVersion($filename){
    $manifestPath = $this->appDir.'/Resources/assets/rev-manifest.json';
    if (!$manifestPath){
      throw new \Exception(sprintf('Missing manifest file "%s"', $manifestPath));
    }
    
    $assets = json_decode(file_get_contents($manifestPath), true);
    if (!isset($assets[$filename])){
      throw new \Exception(sprintf('Missing asset version path for "%s"', $filename));
    }
    
    return $assets[$filename];
  }

  public function getName(){
    return 'asset_version';
  }
}
