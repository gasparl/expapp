# This file presents an example data preprocessing for the Experimental Web App
# results. Actually, a better way may be to get the aggregate results from each
# participant already in the loop (see Lukács, 2021, TQMP). However, people
# often prefer all raw data to be merged together in a single table (with single
# pieces of information as constants in dedicated columns per participant). The
# present script accomplishes this.


library('data.table')
library('neatStats')

# set the result files' folder path as current working directory
setwd(path_neat('/../example_data'))

# get all txt files under the current working directory
f_names = basename(setdiff(
    list.files(
        path = './',
        pattern = ".*\\.txt$",
        recursive = TRUE
    ),
    list.dirs(
        path = './',
        recursive = TRUE,
        full.names = FALSE
    )
))

# get all full files
files_full = f_names[startsWith(f_names, 'sst_')]
# get all partial files (ones not among full)
files_part = f_names[!grepl(paste(files_full, collapse = "|"), f_names)]

# merge all data
data_merged = data.table()
for (f_nam in c(files_full, paste0('partial/', files_part))) {
    # for testing: f_nam = "numcog_HULD_221107080437.txt"
    new_dat = fread(f_nam, fill = TRUE)
    # get miscellaneous info from JSON
    misc_info = jsonlite::fromJSON(new_dat[startsWith(new_dat[[1]], '{')][[1]])
    # if necessary, remove multi-value info (RAF rates):
    # misc_info = misc_info[lengths(misc_info) == 1]
    if (nrow(new_dat) > 1) {
        # if the participant began behavioral task...
        # remove misc info from the original data
        new_dat = new_dat[!startsWith(new_dat[[1]], '{')]
        # convert misc info into full columns (with constant values)
        new_dat = data.frame(new_dat, misc_info)

    } else {
        # in case of no behavioral data, all data is just the misc info
        new_dat = misc_info
    }

    # add to variable containing all participants
    data_merged = rbindlist(list(data_merged, new_dat), fill = TRUE)
}

# if you want it as data.frame (rather than data.table):
# data_merged = as.data.frame(data_merged)

# if you want to write to CSV (or whatever else):
# fwrite(data_merged, file = "numcog_partial_merged.csv", sep = ",")

# if you want it copied to clipboard (e.g. to paste it into MS Excel or such):
# clipr::write_clip(data_merged)
