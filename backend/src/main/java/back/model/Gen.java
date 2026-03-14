package back.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Gen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
<<<<<<< HEAD
    
    private int id_word;
=======
    @ManyToOne
    @JoinColumn(name = "id_word", referencedColumnName = "id")
    private Word word;
>>>>>>> 7b7272459c017c09a31dbd62bffd05e23a54d69a
    private String paststimple;

    public int getId(){return id;}
    public void setId(int id){this.id=id;}
    
    public int getIdWord(){return word.getId();}
    public void setIdWord(int id_word){word.setId(id_word);}

    public String getPastSimple(){return paststimple;}
    public void setPastSimple(String pastsimple){this.paststimple=pastsimple;}

}
