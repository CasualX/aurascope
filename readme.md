Aurascope
=========

A WebApp for live HTML visualization.

http://casualhacks.net/aurascope/index.html

Integration
-----------

For this WebApp to be useful it must connect to a backend server, see the demo for an example server.

The WebSocket server sends text messages of the following format:

```text
Target=TopicName
<h1>Hello World!</h1>
```

When received a new topic 'TopicName' is added to the sidebar, when clicked the remainder of the text message is displayed as HTML.
**Warning!** This is straight up XSS, only connect to trusted servers!

Icons
-----

* https://heroicons.com/
* https://icones.js.org/

License
-------

Licensed under [GPL 3.0 License](https://opensource.org/licenses/GPL-3.0), see [license.txt](license.txt).

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, shall be licensed as above, without any additional terms or conditions.
