# Listen to keyboard events in macos

```Swift
import Cocoa

// Show Privacy & Security settings
func acquiredPermissions() -> Bool {
    if !AXIsProcessTrusted() {
        let options: NSDictionary = [kAXTrustedCheckOptionPrompt.takeRetainedValue() as NSString: true]
        let enabled = AXIsProcessTrustedWithOptions(options)
        return true
    }
    
    return false
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        if acquiredPermissions() {
            // keyboard listeners
            NSEvent.addGlobalMonitorForEvents(matching: .keyDown, handler: { event in
                print(event)
            })
        } else {
            // not have permissions
            exit(0)
        }
    }
}

// preparing main loop
let application = NSApplication.shared
let applicationDelegate = AppDelegate()

application.delegate = applicationDelegate
application.activate(ignoringOtherApps: true)
application.run()
```
