package main

import (
	"log"
	"net/http"
	"net/http/httptest"
	"os/exec"
	"strings"
	"testing"

	"github.com/DucNg/pognon_ts/data"
	"github.com/labstack/echo"
)

var pognonExemple1 = `{"PognonHash":"abcdefgh","Participants":["toma","jean","caroline"]}
`

func init() {
	// Delete any existing database file before running test
	exec.Command("rm", "test.db").Run()
}

func TestPostPognon(t *testing.T) {
	t.Log("Test database creation")
	var err error
	engine, err = data.GetEngine("test.db")
	if err != nil {
		log.Fatal(err)
	}
	defer engine.Close()

	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/api/pognon", strings.NewReader(pognonExemple1))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	t.Log("Test create a new pognon")
	err = postPognon(c)
	if err != nil {
		log.Fatal(err)
	}
	if rec.Code != http.StatusOK {
		log.Fatal("Response wasn't OK", rec.Code)
	}

	req = httptest.NewRequest(http.MethodGet, "/api/pognon/abcdefgh", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("hash")
	c.SetParamValues("abcdefgh")

	t.Log("Test get created pognon")
	err = getPognon(c)
	if err != nil {
		log.Fatal(err)
	}
	if rec.Code != http.StatusOK {
		log.Fatal("Response wasn't OK", rec.Code)
	}
	if rec.Body.String() != pognonExemple1 {
		log.Fatal("Pognon result is not as expected")
	}
}
