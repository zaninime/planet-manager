//
//  Protocol.swift
//  Planet Manager
//
//  Created by Francesco Zanini on 18/09/16.
//  Copyright © 2016 zanini.me. All rights reserved.
//

import Foundation
import WebKit

class Plug: NSObject, WKScriptMessageHandler {
    var webView:WKWebView
    
    init(_ webView:WKWebView) {
        self.webView = webView
        super.init()
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch (message.name) {
        case "plug_fetch":
            fetchGeneric(message.body as! NSDictionary)
            break
        case "plug_save":
            saveGeneric(message.body as! NSDictionary)
            break
        default:
            // nothing
            break
        }
    }
    
    func fetchGeneric(_ params:NSDictionary) {
        DispatchQueue.global(qos: .userInitiated).async { [unowned self] in
            // async stuff here
            DispatchQueue.main.async { [unowned self] in
                //self.webView.evaluateJavaScript("console.log({\"a\": 2});", completionHandler: nil)
            }
        }
    }
    
    func saveGeneric(_ params:NSDictionary) {
        DispatchQueue.global(qos: .userInitiated).async { [unowned self] in
            // async stuff here
            DispatchQueue.main.async { [unowned self] in
                //self.webView.evaluateJavaScript("console.log({\"a\": 2});", completionHandler: nil)
            }
        }
    }
}
