package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os/exec"
	"strings"
	"testing"

	"github.com/DucNg/pognon_ts/data"
	"github.com/labstack/echo"
)

const (
	pognonExemple1 = `{
		"Pognon": {"PognonHash":"abcdefgh"},
		"Participants":[
			{"Name": "toma"},
			{"Name": "jean"},
			{"Name": "caroline"}
		]
}
`
	transaction1 = `{
		"Buyers": [{"IDPerson":1, "Amount":10.25}],
		"For":    [{"IDPerson":1, "Amount":5}, {"IDPerson":2, "Amount":3}, {"IDPerson":3, "Amount":2.25}],
		"Reason": "love"
}
`

	transaction2 = `{
		"Buyers": [{"IDPerson":1, "Amount":1234}],
		"For":	  [{"IDPerson":2, "Amount":300}]
}`

	transaction3 = `{
		"Buyers": [{"IDPerson":30, "Amount":1234}],
		"For":    [{"IDPerson":82, "Amount":1234}]
}`

	personUpdate1 = `{
		"IDPerson": 2,
		"Name": "sava"
}`
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

func testStatus400(t *testing.T, recorder *httptest.ResponseRecorder) {
	if recorder.Code != http.StatusBadRequest {
		t.Fatal("Response wasn't 400", recorder.Code, recorder.Body.String())
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
	log.SetFlags(log.Lshortfile) // Enable line number on error

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

	t.Log("Test create participants")

	t.Log("Test get created pognon")
	c, rec = createEchoContext(t, http.MethodGet, "/api/pognon/abcdefgh", "", "abcdefgh")
	err = getPognonJSON(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)
	dec := json.NewDecoder(rec.Body)
	t.Log(rec.Body.String())
	var p data.PognonJSON
	if err := dec.Decode(&p); err != nil {
		t.Fatal(err)
	}

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
	dec = json.NewDecoder(rec.Body)
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
	testStatus400(t, rec)

	t.Log("Test inequal sums")
	c, rec = createEchoContext(t, http.MethodPost, "/api/pognon/abcdefgh/transaction", transaction2, "abcdefgh")
	err = postTransaction(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatus400(t, rec)

	t.Log("Test non existing IDPerson")
	c, rec = createEchoContext(t, http.MethodPost, "/api/pognon/abcdefgh/transaction", transaction3, "abcdefgh")
	err = postTransaction(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatus400(t, rec)

	t.Log("Test delete person involved in transactions")
	c, rec = createEchoContext(t, http.MethodDelete, "/api/pognon/abcdefgh/person/1", "", "abcdefgh")
	c.SetParamNames("IDPerson")
	c.SetParamValues("1")
	err = deletePerson(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatus400(t, rec)

	t.Log("Test delete transaction")
	c, rec = createEchoContext(t, http.MethodDelete, "/api/pognon/abcdefgh/transaction/1", "", "abcdefgh")
	c.SetParamNames("IDTransaction")
	c.SetParamValues("1")
	err = deleteTransaction(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)

	t.Log("Get deleted item")
	c, rec = createEchoContext(t, http.MethodGet, "/api/pognon/abcdefgh", "", "abcdefgh")
	err = getPognonJSON(c)
	dec = json.NewDecoder(rec.Body)
	if err := dec.Decode(&p); err != nil {
		t.Fatal(err)
	}
	if p.Transactions != nil {
		t.Fatal("Transaction wasn't deleted")
	}

	t.Log("Test delete person")
	c, rec = createEchoContext(t, http.MethodDelete, "/api/pognon/abcdefgh/person/1", "", "abcdefgh")
	c.SetParamNames("IDPerson")
	c.SetParamValues("1")
	err = deletePerson(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)

	t.Log("Get deleted item")
	c, rec = createEchoContext(t, http.MethodGet, "/api/pognon/abcdefgh", "", "abcdefgh")
	err = getPognonJSON(c)
	dec = json.NewDecoder(rec.Body)
	if err := dec.Decode(&p); err != nil {
		t.Fatal(err)
	}
	if len(*p.Participants) > 2 {
		t.Fatal("Person wasn't deleted", *p.Participants)
	}

	t.Log("Test update person")
	c, rec = createEchoContext(t, http.MethodPut, "/api/pognon/abcdefgh/person", personUpdate1, "abcdefgh")
	err = putPerson(c)
	if err != nil {
		t.Fatal(err)
	}
	testStatusOK(t, rec)

	t.Log("Get updated item")
	c, rec = createEchoContext(t, http.MethodGet, "/api/pognon/abcdefgh", "", "abcdefgh")
	err = getPognonJSON(c)
	dec = json.NewDecoder(rec.Body)
	if err := dec.Decode(&p); err != nil {
		t.Fatal(err)
	}
	if (*p.Participants)[0].Name != "sava" {
		t.Fatal("Person wasn't updated correctly", *p.Participants)
	}

}
