package handlers

import (
	"html/template"
	"net/http"
)

type PageData struct {
	Title string
	// Поля для передачи данных из БД/API в шаблон
}

func Index(tmpl *template.Template) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data := PageData{Title: "Главная"}
		// Рендерим только страницу, базовая разметка подключится через {{define "base"}}
		err := tmpl.ExecuteTemplate(w, "base", data)
		if err != nil {
			http.Error(w, "Ошибка рендеринга", http.StatusInternalServerError)
			return
		}
	}
}

func About(tmpl *template.Template) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Аналогично, можно передать данные из БД
		tmpl.ExecuteTemplate(w, "base", PageData{Title: "О нас"})
	}
}