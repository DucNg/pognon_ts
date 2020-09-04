package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/DucNg/pognon_ts/data"
	"github.com/labstack/echo"
)

func getPognon(c echo.Context) error {
	hash := c.Param("hash")

	engine, err := data.GetEngine()
	defer engine.Close()
	if err != nil {
		log.Fatal(err)
	}
	p, err := data.GetPognonJSON(engine, hash)
	if err != nil {
		log.Fatal(err)
	}
	if p == nil {
		return c.JSON(http.StatusNotFound, "No pognon for this hash")
	}

	return c.JSON(http.StatusOK, p)
}

func main() {
	e := echo.New()

	e.GET("/api/:hash", getPognon)

	e.Static("/", "./pognon-web-ui/build")

	fmt.Print("Server running on :8080")
	e.Logger.Fatal(e.Start(":8080"))
}
