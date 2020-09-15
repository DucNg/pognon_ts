package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/DucNg/pognon_ts/data"
	"github.com/go-xorm/xorm"
	"github.com/labstack/echo"
)

var engine *xorm.Engine

func getPognon(c echo.Context) error {
	hash := c.Param("hash")

	p, err := data.GetPognonJSON(engine, hash)
	if err != nil {
		log.Fatal(err)
	}
	if p == nil {
		return c.JSON(http.StatusNotFound, "No pognon for this hash")
	}

	return c.JSON(http.StatusOK, p)
}

func postPognon(c echo.Context) error {
	p := new(data.Pognon)
	if err := c.Bind(p); err != nil {
		log.Fatal(err)
	}
	err := data.WritePognon(engine, p)
	if err != nil {
		log.Fatal(err)
	}
	return c.JSON(http.StatusOK, p)
}

func main() {
	var err error
	engine, err = data.GetEngine()
	if err != nil {
		log.Fatal(err)
	}
	defer engine.Close()
	e := echo.New()

	e.GET("/api/pognon/:hash", getPognon)
	e.POST("/api/pognon", postPognon)

	e.Static("/", "./pognon-web-ui/build")

	fmt.Print("Server running on :8080")
	e.Logger.Fatal(e.Start(":8080"))
}
