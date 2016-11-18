//
//  ViewController.swift
//  Planet Manager
//
//  Created by Francesco Zanini on 26/08/16.
//  Copyright © 2016 zanini.me. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {
    
    var webView:WKWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        let contentController = WKUserContentController()
        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController
        webView = WKWebView(frame: self.view.frame, configuration: configuration)
        
        let plug = Plug(webView)
        contentController.add(plug, name: "plug_fetch")
        contentController.add(plug, name: "plug_save")
        
        //let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web")
        let devURL = URLRequest(url: URL(string: "http://10.0.1.11:3002/")!)
        
        //webView.loadFileURL(url!, allowingReadAccessTo: (url?.deletingLastPathComponent())!)
        webView.load(devURL)
        
        self.view = webView
        self.setNeedsStatusBarAppearanceUpdate()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}

