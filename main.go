package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/DucNg/pognon_ts/data"
	"github.com/go-xorm/xorm"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	sqlite "github.com/mattn/go-sqlite3"
)

var engine *xorm.Engine

func getPognon(c echo.Context) error {
	hash := c.Param("hash")

	p, err := data.GetPognon(engine, hash)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	if p == nil {
		return c.JSON(http.StatusNotFound, "No pognon for this hash")
	}

	return c.JSON(http.StatusOK, p)
}

func getTransactions(c echo.Context) error {
	hash := c.Param("hash")

	p, err := data.GetTransactions(engine, hash)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	if p == nil {
		return c.JSON(http.StatusNotFound, "No transactions for this hash")
	}

	return c.JSON(http.StatusOK, p)
}

func getPognonJSON(c echo.Context) error {
	hash := c.Param("hash")

	p, err := data.GetPognonJSON(engine, hash)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	if p == nil {
		return c.JSON(http.StatusNotFound, "No pognon for this hash")
	}

	return c.JSON(http.StatusOK, p)
}

func postPognon(c echo.Context) error {
	p := new(data.PognonJSON)
	if err := c.Bind(p); err != nil {
		log.Println(err)
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := verifyInputPognon(engine, p); err != nil {
		log.Println(err)
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	err := data.WritePognon(engine, p)
	if err != nil {
		if ee, ok := err.(sqlite.Error); ok && ee.Code == sqlite.ErrConstraint {
			return c.JSON(http.StatusBadRequest, "This pognon already exists")
		}
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, p)
}

func postTransaction(c echo.Context) error {
	t := new(data.Transaction)
	if err := c.Bind(t); err != nil {
		log.Println(err)
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	if err := verifyInputTransaction(engine, t); err != nil {
		log.Println(err)
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	t.PognonHash = c.Param("hash")
	err := data.WriteTransaction(engine, t)
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, t)
}

func main() {
	allowCORS := flag.Bool("allow-cors", false,
		"Allow CORS for test purposes. Allow the usage of the build in node "+
			"server to test frontend.")
	port := flag.String("port", ":8080", "Specify bind address")
	staticFolder := flag.String("staticFolder", "./pognon-web-ui/build",
		"Static folder for frontend files to serve.")
	flag.Parse()

	log.SetFlags(log.Lshortfile) // Enable line number on error

	var err error
	engine, err = data.GetEngine("./pognon.db")
	if err != nil {
		log.Fatal(err)
	}
	defer engine.Close()

	e := echo.New()

	// Serve frontend files staticly
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  *staticFolder,
		HTML5: true,
	}))

	// Disable CORS when we are in a dev environment.
	// Allow the usage of the build in node server to
	// test frontend.
	if *allowCORS {
		e.Use(middleware.CORS())
	}

	// Routes declarations
	e.GET("/api/pognon/:hash", getPognonJSON)
	e.POST("/api/pognon", postPognon)
	e.POST("/api/pognon/:hash/transaction", postTransaction)

	e.Logger.Fatal(e.Start(*port))
}
