package back.controller;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import back.model.Users;
import back.model.Word;
import back.repository.UserRepository;
import back.repository.WordRepository;
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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Users user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new LoginResponse(false, "Email not found", 0));
        }

        if (!user.getParola().equals(request.getParola())) {
            // Trimitem status 401 (Unauthorized) pentru parolă greșită
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Wrong password", 0));
        }
        return ResponseEntity.ok(new LoginResponse(true, "Login succesful", user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody LoginRequest request) {
        // 1. Verificăm dacă email-ul există deja
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // Status 409 Conflict
                    .body(new LoginResponse(false, "Email deja inregistrat", 0));
        }

        // 2. Validare Email cu Regex (am corectat și punctul de la final)
        Pattern pattern = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(request.getEmail());
        if (!matcher.find()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // Status 400 Bad Request
                    .body(new LoginResponse(false, "Format email invalid", 0));
        }
        // 3. Creare utilizator nou
        Users newUser = new Users();
        newUser.setEmail(request.getEmail());
        newUser.setParola(request.getParola());
        newUser.setUsername(request.getUsername());
        newUser.setNivel(1);

        try {
            userRepository.save(newUser);
            return ResponseEntity.status(HttpStatus.CREATED) // Status 201 Created
                    .body(new LoginResponse(true, "Inregistrare reusita", newUser.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // Status 500
                    .body(new LoginResponse(false, "Eroare baza de date: " + e.getMessage(), 0));
        }
    }

    @GetMapping("/getWordsall")
    public List<Word> getWordsall() {
        return wordRepository.findAll();
    }

}
