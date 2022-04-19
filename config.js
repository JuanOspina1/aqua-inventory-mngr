const url1 = "https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=";
//https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=

const getJSON = async function (url) {
  try {
    console.log(url);
    const fetchPro = fetch(url);
    const res = await fetch(fetchPro);
    console.log(res);
    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

const fetchSpecificDrug = async function (drugName) {
  try {
    // const data = await getJSON(`${url}${drugName}`);
    const data = await getJSON(`${url}${drugName}`);

    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

// fetchSpecificDrug("XYZAL");
// This getJSON request adds the data to the local storage after i click the website in the console.
getJSON("https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=arava");
