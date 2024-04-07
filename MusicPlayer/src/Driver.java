/**
 * The Driver class construct instances of each subtype and add them to the library.
 * Then test the remaining MusicLibrary methods to ensure they work correctly
 * @author Aphane Jimmy
 * @version 1.0
 * */
public class Driver
{
    /**
     * Main method that renders the whole project
     * @param args command-line arguments
     * */
    public static void main(String[] args)
    {
        MusicLibrary musicLibrary = new MusicLibrary();

        musicLibrary.addMedia(new Record("The Beatles", "Hey Jane", 1, 7, 1968, 7, 45.0));

        musicLibrary.addMedia(new CompactDisc("Neil Young & Crazy Horse", "Everybody Knows This Is Nowhere", 4, 40, 1969, false, false));

        musicLibrary.addMedia(new AudioFile("Donnie Iris and the Cruisers", "Ah Leah!", 1, 4, 1980, "wav"));

        musicLibrary.displayLibrary();
        System.out.println("\n");

        musicLibrary.playTitle("Everybody Knows This Is Nowhere");
        System.out.println("\n");
        musicLibrary.playTitle("Hey Jane");
        System.out.println("\n");
        musicLibrary.playTitle("Ah Leah!");
    }

    /**
     * Driver default constructor
     * */
    Driver(){}
}
