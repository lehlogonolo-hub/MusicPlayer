import java.util.ArrayList;

/**
 * This class creates and store all MusicMedia player into MusicMedia array
 * @author Aphane Jimmy
 * @version 1.0
 * */
public class MusicLibrary
{

    private final ArrayList<MusicMedia> library;

    /**
     * MusicalLibrary constructor
     * */
    public MusicLibrary() {
        library = new ArrayList<>();
    }


    /**
     * Add a subtype to the ArrayList, first checking to be sure the parameter is not null
     * @param media the media
     * */
    public void addMedia(final MusicMedia media)
    {
        if (media != null)
        {
            library.add(media);
        } else
        {
            throw new NullPointerException("Media: null");
        }
    }


    /**
     * Will iterate over the ArrayList displaying the entire library using toString()
     * */
    public void displayLibrary()
    {
        for (MusicMedia media : library)
        {
            System.out.println(media);
        }
    }


    /**
     * Will validate the parameter appropriately and then search the library for the tile.
     * If found the playSelection() method will be called
     * @param songTitle is the song title
     * */
    public void playTitle(String songTitle)
    {
        if (songTitle == null || songTitle.isEmpty())
        {
            throw new IllegalArgumentException("Title: null or empty");
        }

        boolean found = false;
        for (MusicMedia media : library)
        {
            if (media.getSongTitle().equals(songTitle))
            {
                found = true;
                media.playSelection();
                break;
            }
        }

        if (!found)
        {
            System.out.println("Title not found in the library.");
        }
    }
}
