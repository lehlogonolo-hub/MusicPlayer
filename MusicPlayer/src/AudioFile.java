/**
 * AudioFile class with additional field for file type.
 * The constructor validate file type = “mp3”, “m4a” or  “wav”.
 * AThe class also override both toString() and playSelection().
 * @author Aphane Jimmy
 * @version 1.0
 * */
class AudioFile extends MusicMedia
{

    private final String fileType;

    /**
     * Getter method for file type
     * @return fileType
     * */
    public String getFileType()
    {
        return fileType;
    }


    /**
     * AudioFile constructor
     *
     * @param fileType is the file type
     * @param musicalArtist is the musical artist
     * @param songTitle is the song title
     * @param totalRuntime is the total song runtime
     * @param year is the year the song was released
     * @param totalSongs is the total number of songs
     * @throws IllegalArgumentException when one of the argument is wrong
     * */
    public AudioFile(final String musicalArtist,
                     final String songTitle,
                     final int    totalSongs,
                     final double totalRuntime,
                     final int    year,
                     final String fileType) throws IllegalArgumentException
    {
        super(musicalArtist, songTitle, totalSongs, totalRuntime, year);

        if (!fileType.equalsIgnoreCase("mp3") &&
                !fileType.equalsIgnoreCase("m4a") &&
                !fileType.equalsIgnoreCase("wav"))
        {
            throw new IllegalArgumentException("Invalid file type.");
        }

        this.fileType = fileType;
    }

    @Override
    public String toString()
    {
        return "AudioFile{" +
                "fileType='" + fileType + '\'' +
                '}';
    }

    @Override
    public void playSelection()
    {
        super.playSelection();
        System.out.println("You selected the Audio File " + getSongTitle() + " by " + getMusicalArtist() + " and the " + getMusicalArtist() + ".");
        System.out.println("This file is in " + getFileType() + " format, from the year " + getYear() + ".");
    }
}