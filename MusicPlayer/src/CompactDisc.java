/**
 * The class CompactDisc has additional fields for bonus tracks and digipac, both booleans.
 * The class also override both toString() and playSelection().
 * @author Aphane Jimmy
 * @version 1.0
 * */
public class CompactDisc extends MusicMedia
{
    private final boolean bonusTrack;
    private final boolean digipac;


    /**
     * Getter method for bonus track
     * @return bonusTrack
     * */
    public boolean getBonusTrack() { return bonusTrack; }

    /**
     * Getter method for digipac
     * @return digipac
     * */
    public boolean getDigipac() { return digipac; }

    @Override
    public String toString()
    {
        return "CompactDisc{" +
                "bonusTrack='" + bonusTrack + '\'' +
                ", digipac='" + digipac + '\'' +
                '}';
    }

    @Override
    public void playSelection()
    {
        super.playSelection();
        System.out.println("You selected the CD " + getSongTitle() + " by " + getMusicalArtist() + ".");
        System.out.println("This is Compact Disc from the year " + getYear() + ".");
    }

    /**
     * CompactDisc constructor
     *
     * @param bonusTrack this is the bonus track
     * @param digipac is the digipac
     * @param musicalArtist is the musical artist
     * @param songTitle is the song title
     * @param totalRuntime is the total song runtime
     * @param year is the year the song was released
     * @param totalSongs is the total number of songs
     * @throws IllegalArgumentException when one of the argument is wrong
     * */
    public CompactDisc(final String musicalArtist,
                       final String songTitle,
                       final int    totalSongs,
                       final double totalRuntime,
                       final int    year,
                       final boolean bonusTrack,
                       final boolean digipac) throws IllegalArgumentException
    {
        super(musicalArtist, songTitle, totalSongs, totalRuntime, year);

        this.bonusTrack = bonusTrack;
        this.digipac = digipac;
    }
}
