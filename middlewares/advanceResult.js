// model,.populate

const advanceResults = (model, populate) => {
  return async (req, res, next) => {
    //console.log(req.res);

    let TeachersQuery = model.find({
      name: "jayden",
    });

    //const teachers = await Teacher.find({})

    // get total record
    const total = await model.countDocuments();

    //convert query string to number
    const limit = Number(req.query.limit) || 1;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};

    // populate
    if (populate) {
      TeachersQuery = TeachersQuery.populate(populate);
    }

    //filtering/searching
    if (typeof req.query.name === "string") {
      TeachersQuery = TeachersQuery.find({
        name: { $regex: req.query.name, $options: "i" },
      });
    }

    //add next
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    //add prev
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    // if (!teachers || teachers.length === 0) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: "no Teachers found",
    //   });
    // } else {

    //Execise query
    const teachers = await TeachersQuery.find().skip(skip).limit(limit);
    //res.status(200).json(res.myData);

    res.results = {
      status: "success",
      message: "Teachers fetched successfully",
      data: teachers,
      total,
      pagination,
      result: teachers.length,
    };
    next();
  };
};

module.exports = advanceResults;
