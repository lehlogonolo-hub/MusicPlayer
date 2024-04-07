# MusicPlayer

This is a class hierarchy that features supertype MusicMedia, which has fields for musical artist, song title, total number of songs, total runtime, and year. The overloaded constructor validate all fields and throw an IllegalArgumentException when “bad” data is entered. The class implement getters for each field, toString(), and the void playSection() method. The playSelection() method display the following message when called; “Thank you for using our Music Library.”

a. Record subtype, which have additional fields for size of the record in inches, double rpm(revolutions per minute). The constructor validate these fields to ensure the size is one of 7”, 10”, 12” and throw an IllegalArgumentException for any other value. Similarly, the constructor validate rpm for 33.3, 45.0 or 78.0. Record also override both toString() and playSelection(). 

b. AudioFile subtype, which have the additional field for file type. The constructor validate the to ensure the file type is one of either “mp3”, “m4a” or  “wav”. AudioFile also override both toString() and playSelection().

c. CompactDisc, it has additional fields for bonus tracks and digipac, both booleans. CompactDisc also override both toString() and playSelection().

A class MusicLibrary
This class support an ArrayList<MusicMedia> by implementing the methods void addMedia(MusicMedia media), void displayLibrary(),void playTitle(String title).
i. void addMedia(MusicMedia media) add a subtype to the ArrayList, first checking to be sure the parameter is not null

ii.	void displayLibrary() iterate over the ArrayList displaying the entire library using toString()

iii.	void playTitle(String title) validate the parameter appropriately and then search the library for the tile. If found the playSelection() method be called.

Finally, create a driver class construct instances of each subtype and add them to the library. Then test the remaining MusicLibrary methods to ensure they work correctly
