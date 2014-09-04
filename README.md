### Dominus ###
http://dominusgame.net

Dominus is a multiplayer browser strategy game.  Players grow in power by attacking another player's castle.  Conquering someone's castle makes them your vassal.  Vassals send their lord 25% of their income.  If everyone in the game is your vassal or a vassal of your vassal then you are the Dominus.

Dominus is a slow strategy game that is designed to not require a lot of time to play.  Army movement and resource gathering happen slowly over time.  Login, give your armies their orders then check back in a few hours.

The game is able to support any number of people.  As more people join the map grows creating a larger gameplay space.

Dominus is made using the web platform <a href="http://meteor.com">Meteor.js</a>.


### Steps to run ###

* Install Meteor.js
* Run "meteor update" to install packages.
* Duplicate the file "run_temp".  "mv run_temp run"
* "chmod +x run"
* Fill in the run file with your info.  This file is in the .gitignore and never checked in.
* Do the same with "stripe_temp.js"
* Start game with "./run"

.art/process_renders requires ImageMagick


### Packages ###

The best way I've found to work with packages is to create a symlink to them.  Instructions are <a href="https://meteor.hackpad.com/Unipackage-tvas8pXYMOW">here</a> for creating packages.  Add the package with "meteor add user:package".  Create a symlink with "ln -s /path/to/package /path/to/dominus/packages".  When you're done publish the package with "meteor publish".  There is a .gitignore in dominus/packages so that they aren't added (might not be needed).

* <a href="https://github.com/dan335/dominus-settings">Settings Package</a>
* <a href="https://github.com/dan335/dominus-battle">Battle Package</a>
* <a href="https://github.com/dan335/dominus-minimap">Minimap Package</a>


### Known Issues ###

* Issues are tracked at https://bitbucket.org/daniel_phillips/gridgame/issues?status=new&status=open and should probably be moved to github.
* There are some notes in the top of battle.js in the battle package about some things that need fixing.