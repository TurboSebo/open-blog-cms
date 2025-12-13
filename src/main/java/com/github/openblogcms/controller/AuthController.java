package com.github.openblogcms.controller;

import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import com.github.openblogcms.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/login")
    public String login(Model model, @RequestParam(value = "error", required = false) String error) {
        if (error != null) {
            model.addAttribute("error", "Nieprawidłowy login lub hasło");
        }
        return "login";
    }

    @PostMapping("/login")
    public String doLogin(@RequestParam String username,
                          @RequestParam String password,
                          HttpSession session) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .map(user -> {
                    session.setAttribute("currentUser", user);
                    session.setAttribute("currentRole", user.getRole());
                    if (user.getRole() >= Role.ADMIN) {
                        return "redirect:/admin";
                    }
                    return "redirect:/";
                })
                .orElse("redirect:/login?error");
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    // Prosty demonstracyjny endpoint zwracający tekst zamiast widoku
    @GetMapping("/login-demo")
    @ResponseBody
    public String loginDemo() {
        return "Tu będzie strona logowania"; // Tekst pokazujący działanie @ResponseBody
    }
}
