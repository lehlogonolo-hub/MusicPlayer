/**
 * This is a class hierarchy that features supertype MusicMedia,
 * Which has fields for musical artist, song title, total number of songs, total runtime, and year.
 * The overloaded constructor validate all fields and throw an IllegalArgumentException if “bad” data is entered.
 * The class implement getters for each field, toString(), and the void playSection() method.
 * The playSelection() method will display “Thank you for using our Music Library.”
 * @author Aphane Jimmy
 * @version 1.0
 * */
class MusicMedia
{

    private final String musicalArtist;
    private final String songTitle;
    private final int totalSongs;
    private final double totalRuntime;
    private final int year;

    private static final int INDEX = 0;

    /**
     * MusicMedia constructor
     * @param totalSongs is the number of total songs
     * @param year is the year music was released
     * @param totalRuntime is the total song runtime
     * @param songTitle is the song title
     * @param musicalArtist is the musical artist
     * @throws IllegalArgumentException when one of the instances is wrong
     * */
    public MusicMedia(final String musicalArtist,
                      final String songTitle,
                      final int totalSongs,
                      final double totalRuntime,
                      final int year) throws IllegalArgumentException
    {
        if (    musicalArtist == null   ||
                musicalArtist.isEmpty() ||
                songTitle == null       ||
                songTitle.isEmpty()     ||
                totalSongs <= INDEX     ||
                totalRuntime <= INDEX   ||
                year < INDEX)
        {
            throw new IllegalArgumentException("Invalid media data");
        }
        this.musicalArtist = musicalArtist;
        this.songTitle     = songTitle;
        this.totalSongs    = totalSongs;
        this.totalRuntime  = totalRuntime;
        this.year          = year;
    }

    /**
     * Getter method for musicalArtist
     * @return musicalArtist
     * */
    public String getMusicalArtist() { return musicalArtist; }

    /**
     * Getter method for song title
     * @return songTitle
     * */
    public String getSongTitle() { return songTitle; }

    /**
     * Getter method for totalSongs
     * @return totalSongs
     * */
    public int getTotalSongs() { return totalSongs; }

    /**
     * Getter method for totalRuntime
     * @return totalRuntime
     * */
    public double getTotalRuntime() { return totalRuntime; }

    /**
     * Getter method for year songs was released
     * @return year
     * */
    public int getYear() { return year; }

    @Override
    public String toString()
    {
        return "Album [Artist=" + musicalArtist +
                ", title=" + songTitle +
                ", trackCount=" + totalSongs +
                ", totalMinutes=" + totalRuntime + "]";
    }

    /**
     * playSelection that display 'thank you' message to user
     * */
    public void playSelection()
    {
        System.out.println("Thank you for using our Music Library.");
    }
}