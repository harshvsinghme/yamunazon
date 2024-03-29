import Product from "../../../models/ProductModel";

const Pid = async (req, res) => {
	switch (req.method) {
		case "GET":
			await getProperty(req, res);
			break;
		case "DELETE":
			await deleteProperty(req, res);
		case "PUT":
			await updateProduct(req, res);
	}
};

const getProperty = async (req, res) => {
	const { pid } = req.query;
	const product = await Product.findById(pid);
	res.status(200).json({ product });
};
const deleteProperty = async (req, res) => {
	const { pid } = req.query;
	await Product.findByIdAndDelete(pid);
	res.status(200).json();
};
const updateProduct = async (req, res) => {
	const { pid } = req.query;
	await Product.findOneAndUpdate({ _id: pid }, req.body);
	res.status(200).json();
};

export default Pid;
