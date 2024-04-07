/**
 * This Record class inherits MusicMedia attributes, and it has additional fields for size of the record in inches, double rpm(revolutions per minute).
 * The constructor validate these fields to ensure the size is one of FIRST_INCH_SIZE, SECOND_INCH_SIZE, THIRD_INCH_SIZE and throw an IllegalArgumentException for any other value.
 * The constructor also validate rpm for FIRST_RPM_SIZE, SECOND_RPM_SIZE or THIRD_RPM_SIZE.
 * The class override both toString() and playSelection().
 * @author Aphane Jimmy
 * @version 1.0
 * */
class Record extends MusicMedia
{

    private final double recordSize;
    private final double rpm;

    private static final int FIRST_INCH_SIZE =  7;
    private static final int SECOND_INCH_SIZE = 10;
    private static final int THIRD_INCH_SIZE =  12;

    private static final double FIRST_RPM_SIZE =  33.3;
    private static final double SECOND_RPM_SIZE = 45.0;
    private static final double THIRD_RPM_SIZE =  78.0;


    /**
     * Record constructor
     *
     * @param recordSize this is the record size
     * @param rpm is the rpm
     * @param musicalArtist is the musical artist
     * @param songTitle is the song title
     * @param totalRuntime is the total song runtime
     * @param year is the year the song was released
     * @param totalSongs is the total number of songs
     * @throws IllegalArgumentException when one of the argument is wrong
     * */
    public Record(final String musicalArtist,
                  final String songTitle,
                  final int    totalSongs,
                  final double totalRuntime,
                  final int    year,
                  final double recordSize,
                  final double rpm) throws IllegalArgumentException
    {
        super(musicalArtist, songTitle, totalSongs, totalRuntime, year);

        // recordSize and rpm validation
        if (recordSize != FIRST_INCH_SIZE && recordSize != SECOND_INCH_SIZE && recordSize != THIRD_INCH_SIZE)
        {
            throw new IllegalArgumentException("Invalid record size.");
        }
        if (rpm != FIRST_RPM_SIZE && rpm != SECOND_RPM_SIZE && rpm != THIRD_RPM_SIZE)
        {
            throw new IllegalArgumentException("Invalid RPM.");
        }

        this.recordSize = recordSize;
        this.rpm = rpm;
    }

    @Override
    public String toString()
    {
        return super.toString() +
                "\nRecord [size=" + recordSize +
                ", rpm=" + rpm +
                "]";
    }

    @Override
    public void playSelection()
    {
        super.playSelection();
        System.out.println("You selected the record " + getSongTitle() + " by " + getMusicalArtist() + ".");
        System.out.println("This is a " + recordSize + " inch record from " + getYear() + ", playing at " + rpm + " rpm.");
    }
}
