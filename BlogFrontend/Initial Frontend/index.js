document.getElementById("readMoreLink").addEventListener("click", function () {
    Swal.fire({
        title: "10 Simple Habits for a More Fufilling Life",
        html: `
        <p class="text-left text-gray-700 leading-relaxed max-h-64 overflow-y-auto text-left px-2">
          We often think big changes are the key to a happier life, but it’s the small daily choices that quietly shape our days — and our outlook. Here are ten habits you can start weaving into your routine that can make life feel richer and more balanced.<br><br>

1. Start Your Day with Gratitude

Before reaching for your phone, take a moment to notice something you’re thankful for. It sets a calmer tone for the day.<br><br>

2. Move Your Body Daily

You don’t need a gym membership — a walk, stretch, or quick dance session is enough to lift energy and mood.<br><br>

3. Eat Mindfully

Slow down and actually taste your meals. Mindful eating helps you reconnect with food instead of just rushing through it.<br><br>

4. Limit Digital Noise

Set aside pockets of time where your phone stays out of reach. Those pauses give your mind breathing space.<br><br>

5. Keep Learning

Pick up a book, podcast, or online course. Curiosity keeps life interesting and your brain sharp.<br><br>

6. Simplify Your Space

A tidy environment brings surprising clarity. Start small — maybe just your desk or one drawer.<br><br>

7. Practice Active Listening

When someone’s talking, really hear them instead of planning your reply. It deepens connection instantly.<br><br>

8. Give Generously

It doesn’t have to be money — time, kindness, or even a smile can shift someone’s day, and yours too.<br><br>

9. Reflect Before Bed

Jot down what went well, what you learned, or what made you smile. It anchors your day with meaning.<br><br>

10. Be Kind to Yourself

Drop the harsh self-talk. Treat yourself with the same patience you’d offer a close friend.
        </p>
      `,
        backdrop: `
            rgba(0,0,0,0.4)
            left top
            no-repeat
        `,

        didOpen: () => {
            document.querySelector('.swal2-container').style.backdropFilter = 'blur(6px)';
        },
        width: 800,
        padding: "2em",
        color: "#333",
        background: "#d6d8d8ff",
        confirmButtonText: "Close",
        confirmButtonColor: "#0f766e"
        
    });
});


html: `<div class="text-gray-700 leading-relaxed">
         <p class="mb-4">This is a longer story text block styled with Tailwind.</p>
         <p class="font-semibold">– Written by You</p>
       </div>`



document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarContainer = document.getElementById('navbar-container');

   if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Toggle opacity and visibility to show/hide the menu
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('invisible');
        mobileMenu.classList.toggle('opacity-100');
        mobileMenu.classList.toggle('visible');
    });
    

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
              mobileMenu.classList.add('hidden');
              navbarContainer.classList.add("rounded-b-lg");
              navbarContainer.classList.remove("bg-teal-400");
            }
        });
    }
});