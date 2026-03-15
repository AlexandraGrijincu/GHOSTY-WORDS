package back.controller;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import back.model.Users;
import back.model.Word;
import back.model.nivel4_word;
import back.repository.Nivel4Repository;
import back.repository.UserRepository;
import back.repository.WordRepository;
import back.service.ScorService;
import dto.LoginRequest;
import dto.LoginResponse;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private ScorService scorService; // Injectăm serviciul de scor

    // DTO pentru request-ul de scor (poate fi mutat și în pachetul dto)
    public static class ScoreRequest {
        public int userId;
        public int score;
        public int level;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Users user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new LoginResponse(false, "Email not found", 0));
        }

        if (!user.getParola().equals(request.getParola())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Wrong password", 0));
        }
        return ResponseEntity.ok(new LoginResponse(true, "Login succesful", user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody LoginRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new LoginResponse(false, "Email deja inregistrat", 0));
        }

        Pattern pattern = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(request.getEmail());
        if (!matcher.find()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LoginResponse(false, "Format email invalid", 0));
        }

        Users newUser = new Users();
        newUser.setEmail(request.getEmail());
        newUser.setParola(request.getParola());
        newUser.setUsername(request.getUsername());
        newUser.setNivel(1);
        newUser.setScor(0); // Inițializăm scorul cu 0

        try {
            userRepository.save(newUser);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new LoginResponse(true, "Inregistrare reusita", newUser.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Eroare baza de date: " + e.getMessage(), 0));
        }
    }

    // --- METODE PENTRU SCOR ȘI PROGRES ---

    @PostMapping("/battle/save")
    public ResponseEntity<String> saveScore(@RequestBody ScoreRequest request) {
        try {
            scorService.adaugaScor(request.userId, request.score);
            return ResponseEntity.ok("Scor salvat cu succes!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la salvare scor");
        }
    }

    @PostMapping("/user/update-progress")
    public ResponseEntity<String> updateProgress(@RequestBody ScoreRequest request) {
        try {
            scorService.actualizeazaNivel(request.userId, request.level);
            return ResponseEntity.ok("Progres actualizat!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la update progres");
        }
    }

    @GetMapping("/getWordsall")
    public List<Word> getWordsall() {
        return wordRepository.findAll();
    }

    @Autowired
    private Nivel4Repository repository; 
    @GetMapping("/verbe")
    public List<nivel4_word> getVerbe() {
        return repository.findAll();
    }
}