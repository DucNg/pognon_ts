package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os/exec"
	"strings"
	"testing"

	"github.com/DucNg/pognon_ts/data"
	"github.com/labstack/echo"
)

const (
	pognonExemple1 = `{"PognonHash":"abcdefgh","Participants":["toma","jean","caroline"]}
`
	transaction1 = `{
		"Buyers": [{"Person":"a", "Amount":10.25}],
		"For":    [{"Person":"a", "Amount":5}, {"Person":"c", "Amount":3}, {"Person":"a", "Amount":2.25}],
		"Reason": "love"
}
`
)

func init() {
	// Delete any existing database file before running test
	exec.Command("rm", "test.db").Run()
}

func createEchoContext(t *testing.T, method string, target string, jsonRequest string, hash string) (echo.Context, *httptest.ResponseRecorder) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, target, strings.NewReader(jsonRequest))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("hash")
	c.SetParamValues(hash)

	return c, rec
}

func testStatusOK(t *testing.T, recorder *httptest.ResponseRecorder) {
	if recorder.Code != http.StatusOK {
		t.Fatal("Response wasn't OK", recorder.Code, recorder.Body.String())
	}
}

func testStatus500(t *testing.T, recorder *httptest.ResponseRecorder) {
	if recorder.Code != http.StatusInternalServerError {
		t.Fatal("Response wasn't 500", recorder.Code, recorder.Body.String())
	}
}

func testResult(t *testing.T, recorder *httptest.ResponseRecorder, expected string) {
	testStatusOK(t, recorder)
	if recorder.Body.String() != expected {
		t.Log("Expected: ", expected)
		t.Log("Received: ", recorder.Body.String())
		t.Fatal("Pognon result is not as expected")
	}
}

func TestPostPognon(t *testing.T) {
	t.Log("Test database creation")
	var err error
	engine, err = data.GetEngine("test.db")
	if err != nil {
		t.Fatal(err)
	}
	defer engine.Close()

	t.Log("Test create a new pognon")
	c, rec := createEchoContext(t, http.MethodPost, "/api/pognon", pognonExemple1, "")
	err = postPognon(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)

	t.Log("Test get created pognon")
	c, rec = createEchoContext(t, http.MethodGet, "/api/pognon/abcdefgh", "", "abcdefgh")
	err = getPognon(c)
	if err != nil {
		t.Fatal(err)
	}
	testResult(t, rec, pognonExemple1)

	t.Log("Test add transaction")
	c, rec = createEchoContext(t, http.MethodPost, "/api/pognon/abcdefgh/transaction", transaction1, "abcdefgh")
	err = postTransaction(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)

	t.Log("Test get created transaction")
	c, rec = createEchoContext(t, http.MethodGet, "/api/pognon/abcdefgh/transaction", "", "abcdefgh")
	err = getTransactions(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)
	dec := json.NewDecoder(rec.Body)
	var t1 []data.Transaction
	if err := dec.Decode(&t1); err != nil {
		t.Fatal(err)
	}

	t.Log("Test transaction for non existing hash")
	c, rec = createEchoContext(t, http.MethodPost, "/api/pognon/invalid/transaction", transaction1, "invalid")
	err = postTransaction(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatus500(t, rec)

}
