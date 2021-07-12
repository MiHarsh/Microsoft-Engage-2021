# Features :

## Homepage
* Host a meeting instantly (No Sign in required)
	* When clicked on host a meeting, a new meet is created instantly
* Join a meeting instantly (No Sign in required)
	* When clicked on join a meeting, a new popup shows, users can paste the meeting code and join meets.
* Login/Signup 
	* Users can have access to premium features, such as create rooms, share rooms, manage previous chats, calender, themes etc. 

## Dashboard
* Chat Rooms
	* Users can have multiple rooms, each rooms have their own ids. 
	* A personal room for users to store their drafts/ important stuffs. Users can share these rooms.
	* A user can join/create multiple rooms. 
	* Link sharing to easily allow multiple members join rooms.
	* Users have access to previous chats.
	* Easy bifurcation between senders and the user . Default alignment for remote sender is left while local user is right.
	* User can join room's meeting by a single click.
	* All the chats ie. meeting'chat and dashboard's chat are synced. Users can send/ recieve messages from the meet/dashboard both.
* Meetings
	* Schedule a meet: User can create meeting rooms, and share them. Each time user creates a room, he is by default added to the room.
	* Join a meet: Joins a meeting instantly.
* Calender :
	* Widget
* Settings 
	* Contains custom settings for the navigation bar, theme switching, toggling of navigation bar.
* Logout

## Meet
* Video Call with multiple people support
*  Admit/deny users
	* Any time a new user joins the meet, a request popups. 
	* Admin could either admit or deny.  
	* Tones whenever user joins (participants) or admit request popups (admin) .
* Video/audio on/off
* Video pinning /Muting other participants
	* Users can pin video/ mute participants.
* Screen sharing
* Recordings
	* Both video and screen could be recorded on a single click. Recorded files are stored locally.
* Chats
	* Users can chat with fellow participants once admitted.
	* Everytime a new message arrives, a tone and a batch is displayed.
* Meeting Link sharing
	* Participants could easily share meeting links.
* Real time Date/Time Update
* **Have-a-break functionality**
	*	Conveys admin for a break without disrupting the meeting. The time could be set customly ( for now, it popups after 1:30 minutes since the start of the meet).
	*	Poll visible only to the participants, hence no interruption to the admin.
	*	Once more than 50% of the current participants vote for a break, admin would be notified.

## Discussions
* ### Adding new members to a Room.
	* Option 1:
		* Admin adds using email ID.
			* Problem : This feature won't be scalable if a user manages an organisation, adding 100s of 1000s of people would be a huge issue.
	* Option 2: 
		* Add via invite links.
			* We could add any number of users by just sharing an invite link.  
			* Problem : (With the current implementation)
				* Any user, who has the link, could join the room. Any unauthorized person could also get access easily.
					* Solution 1:
						* Admin should generate a new invite link for every user with autoexpiry, (non scalable) .
					* Solution 2:
						* Don't let users join directly. Need approval.   
* ### Loading Previous Chats
	* Option 1:
		* Load every chat, of every room at the start.
			* Problem:
				* If a user is in multiple rooms, and has 1000s of chats in total, loading all at once would increase the load of server, also may take longer loading time.
	* Option 2:
		* Load the chats only when users enters the room for the first time.
		* How does this helps ? 
			* Chats are loaded as per user's requirement, hence faster loading time.
			* Server requests decreases at a significant level.
* ### Have-a-break Functionality
	* Implementation Details:
		* Admin joins the room. A timer continuously monitor's meet on-timing.
		* Once the on-time equals defined period of time ie. 90 sec (as of now) , admin (socket) triggers server to send popups to other users. This could be easily done using 
		` socket.to(roomName).emit('askForPoll'); ` 
		* Every time the clients recieve this event, a popup is raised, and the votes are stored.
		* When more than 50% of the current participants request for break, a popup is sent to admin.
		`socket.to(adminOfRoom[data.room]).emit("adminGiveABreak");`
* ### User Dashboard and Meet Syncing
	* We primarily needed a new feature (Adapt phase) which could allow users
		* View & Send messages.  
		* Continue the conversation after the meeting.
		* Start the conversation before the meeting.
	* I have used two namespaces, `/stream` for meeting and `/user` for dashboard  chats.
	* Socket io provides easy way to share data between two namespaces
	`io.of('/stream').to(data.room).emit('chat',{  sender: data.sendername,  msg: data.message  });` 
	This could share data from `/user` namespace to `/stream` namespace.
	* Hence integration of *Adapt* feature with the current implementation, was very easy.
* ### Number of Rooms which could be created in parallel
	* The current Webapp has been implemented in such a way that it could support multiple meetings, each consisting of multiple users simultaneously. 

* ### Implementation Details
	* Tech Stacks Used:
		* Socketio
		* WebRTC
		* Firebase ( for Database )
		*  Node, express JS (Server)
		* HTML, CSS
