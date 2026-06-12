const modals = document.querySelectorAll("[data-modouble]");

modals.forEach(function (trigger) {
  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    const modouble = document.getElementById(trigger.dataset.modouble);
    modouble.classList.add("open");
    const exits = modouble.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modouble.classList.remove("open");
      });
    });
  });
});